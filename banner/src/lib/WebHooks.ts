import * as crypto from 'crypto'
import * as https from 'https'
import * as http from 'http'
import { parse as urlParse } from 'url'
import { Redis } from 'ioredis'
import { EventEmitter } from 'events'

type Options = {
    redisClient?: Redis
}

interface DB {
    [key: string]: string[]
}

interface HashTable<T> {
    [key: string]: T
}

type RequestFunction = (name: string, jsonData: {}, headersData?: {}) => Promise<void>

type PostRequestResponse = {
    body: string
    statusCode: number
}

export class URLExistsError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'URL Exists'
    }
}

export class URLNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'URL Not Found'
    }
}

export class NameNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'Name Not Found'
    }
}

export class WebHooks {
    #redisClient: Redis
    #emitter: EventEmitter
    #requestFunctions: HashTable<RequestFunction>
    constructor({ redisClient }: Options) {
        this.#redisClient = redisClient
        this.#emitter = new EventEmitter()
        this.#requestFunctions = {}
        this.#setListeners()
    }

    #setListeners = async () => {
        const keys = await this.#redisClient.keys('*')
        keys.map(async (key: string) => {
            const urls: string[] = JSON.parse(await this.#redisClient.get(key))
            urls.forEach(url => {
                const encUrl = crypto.createHash('md5').update(url).digest('hex')
                this.#requestFunctions[encUrl] = this.#getRequestFunction(url)
                this.#emitter.on(key, this.#requestFunctions[encUrl])
            })
        })
        this.#emitter.emit('setListeners')
    }

    #postRequest = async (
        url: string,
        jsonData: {},
        headersData?: {}
    ): Promise<PostRequestResponse> => {
        console.log(url)
        const { host, port, path } = urlParse(url)
        console.log(host, port, path)
        const body = JSON.stringify(jsonData)
        // const HTTP = protocol === 'https' ? https : http
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    host,
                    port,
                    path,
                    method: 'POST',
                    headers: {
                        ...headersData,
                        'Content-Length': body.length
                    }
                },
                res => {
                    const { statusCode } = res
                    const buffer: Uint8Array[] = []
                    if (statusCode < 200 || statusCode >= 300) {
                        return reject(new Error('statusCode=' + statusCode))
                    }
                    res.on('data', chunk => {
                        buffer.push(chunk)
                    })
                    res.on('end', () => {
                        const body = Buffer.concat(buffer).toString()
                        resolve({ body, statusCode })
                    })
                }
            )
            req.on('error', err => {
                reject(err)
            })
            req.write(body)
            req.end()
        })
    }

    #getRequestFunction = (url: string): RequestFunction => {
        return async (name: string, jsonData: {}, headersData?: {}): Promise<void> => {
            console.log('==========', url)
            const { body, statusCode } = await this.#postRequest(url, JSON.stringify(jsonData), {
                headers: {
                    headers: {
                        ...headersData,
                        'Content-Type': 'application/json'
                    }
                }
            })

            this.#emitter.emit(`${name}.status`, name, statusCode, body)
        }
    }

    #removeUrlFromName = async (name: string, url: string): Promise<void> => {
        const urls: string[] = JSON.parse(await this.#redisClient.get(name))
        if (urls.indexOf(url) !== -1) {
            urls.splice(urls.indexOf(url), 1)
            await this.#redisClient.set(name, JSON.stringify(urls))
        } else {
            throw new URLNotFoundError(`URL(${url}) not found wile removing from Name(${name}).`)
        }
    }

    #removeName = async (name: string): Promise<void> => {
        await this.#redisClient.unlink(name)
    }

    /**
     * @param  {string} name
     * @param  {Object} jsonData
     * @param  {Object} headersData?
     */
    trigger = (name: string, jsonData: {}, headersData?: {}) => {
        this.#emitter.emit(name, name, jsonData, headersData)
    }

    /**
     * Add WebHook to name.
     *
     * @param  {string} name
     * @param  {string} url
     */
    add = async (name: string, url: string): Promise<void> => {
        const urls = (await this.#redisClient.exists(name))
            ? JSON.parse(await this.#redisClient.get(name))
            : []
        if (urls.indexOf(url) === -1) {
            urls.push(url)
            const encUrl = crypto.createHash('md5').update(url).digest('hex')
            this.#requestFunctions[encUrl] = this.#getRequestFunction(url)
            this.#emitter.on(name, this.#requestFunctions[encUrl])
            await this.#redisClient.set(name, JSON.stringify(urls))
        } else {
            throw new URLExistsError(`URL(${url}) already exists for name(${name}).`)
        }
    }

    /**
     * Remove URL from specified name. If no URL is specified, then remove name from Database.
     *
     * @param  {string} name
     * @param  {string} url?
     */
    remove = async (name: string, url?: string): Promise<void> => {
        if (!(await this.#redisClient.exists(name)))
            throw new NameNotFoundError(`Name(${name}) not found while removing.`)
        if (url) {
            await this.#removeUrlFromName(name, url)
            const urlKey = crypto.createHash('md5').update(url).digest('hex')
            this.#emitter.removeListener(name, this.#requestFunctions[urlKey])
            delete this.#requestFunctions[urlKey]
        } else {
            this.#emitter.removeAllListeners(name)
            const urls: string[] = JSON.parse(await this.#redisClient.get(name))
            urls.forEach(url => {
                const urlKey = crypto.createHash('md5').update(url).digest('hex')
                delete this.#requestFunctions[urlKey]
            })
            await this.#removeName(name)
        }
    }

    /**
     * Return all names, and URL arrays.
     *
     * @returns Promise
     */
    getDB = async (): Promise<DB> => {
        const keys = await this.#redisClient.keys('*')
        const pairs = await Promise.all(
            keys.map(async (key: string) => {
                const urls = JSON.parse(await this.#redisClient.get(key))
                return [key, urls]
            })
        )
        return Object.fromEntries(pairs)
    }

    /**
     * Return array of URLs for specified name.
     *
     * @param  {string} name
     * @returns Promise
     */
    getWebHook = async (name: string): Promise<string> => {
        if (!(await this.#redisClient.exists(name)))
            throw new NameNotFoundError(`Name(${name}) not found while getWebHook.`)
        return await this.#redisClient.get(name)
    }

    /**
     * Return array of URLs for specified name.
     *
     * @param  {string} name
     * @returns Promise
     */

    /**
     * Return all request functions hash table
     *
     * @returns HashTable
     */
    get requestFunctions(): HashTable<RequestFunction> {
        return this.#requestFunctions
    }

    /**
     * Return EventEmitter instance.
     *
     * @returns EventEmitter
     */
    get emitter(): EventEmitter {
        return this.#emitter
    }
}

export default WebHooks
