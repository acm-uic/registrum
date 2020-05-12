import * as crypto from 'crypto'
import fetch from 'node-fetch'
import { EventEmitter } from 'events'
import * as mongoose from 'mongoose'
import { HookSchema } from '../interfaces/Schemas'

export type Hook = {
    _id: string
    urls: string[]
}

export const HookModel = mongoose.model<Hook & mongoose.Document>('Hook', HookSchema)

type Options = {
    mongooseConnection?: mongoose.Connection
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
    #mongooseConnection: mongoose.Connection
    #emitter: EventEmitter
    #requestFunctions: HashTable<RequestFunction>
    constructor({ mongooseConnection }: Options) {
        this.#mongooseConnection = mongooseConnection
        this.#emitter = new EventEmitter()
        this.#requestFunctions = {}
        this.#setListeners()
    }

    #setListeners = async () => {
        const hooks = await HookModel.find({})
        hooks.map(async (hook: Hook) => {
            hook.urls.forEach(url => {
                const encUrl = crypto.createHash('md5').update(url).digest('hex')
                this.#requestFunctions[encUrl] = this.#getRequestFunction(url)
                this.#emitter.on(hook._id, this.#requestFunctions[encUrl])
            })
        })
        this.#emitter.emit('setListeners')
    }

    #getRequestFunction = (url: string): RequestFunction => {
        return async (name: string, jsonData: {}, headersData?: {}): Promise<void> => {
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(jsonData),
                headers: {
                    ...headersData,
                    'Content-Type': 'application/json'
                }
            })
            const { status } = res
            const body = await res.text()
            this.#emitter.emit(`${name}.status`, name, status, body)
        }
    }

    #removeUrlFromName = async (name: string, url: string): Promise<void> => {
        const urls = (await HookModel.findById(name)).urls
        if (urls.indexOf(url) !== -1) {
            urls.splice(urls.indexOf(url), 1)
            await HookModel.findByIdAndUpdate(name, { urls })
        } else {
            throw new URLNotFoundError(`URL(${url}) not found wile removing from Name(${name}).`)
        }
    }

    #removeName = async (name: string): Promise<void> => {
        await HookModel.findByIdAndDelete(name)
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
        const hook = await HookModel.findById(name)
        const urls = !!hook ? hook.urls : []

        if (urls.indexOf(url) === -1) {
            urls.push(url)
            const encUrl = crypto.createHash('md5').update(url).digest('hex')
            this.#requestFunctions[encUrl] = this.#getRequestFunction(url)
            this.#emitter.on(name, this.#requestFunctions[encUrl])
            if (!!hook) {
                await HookModel.findByIdAndUpdate(name, { urls })
            } else {
                await HookModel.create({
                    _id: name,
                    urls
                })
            }
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
        const hook = await HookModel.findById(name)
        if (!hook) throw new NameNotFoundError(`Name(${name}) not found while removing.`)
        if (url) {
            await this.#removeUrlFromName(name, url)
            const urlKey = crypto.createHash('md5').update(url).digest('hex')
            this.#emitter.removeListener(name, this.#requestFunctions[urlKey])
            delete this.#requestFunctions[urlKey]
        } else {
            this.#emitter.removeAllListeners(name)
            hook.urls.forEach(url => {
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
        const hooks = await HookModel.find({})
        const pairs = await Promise.all(hooks.map(async (hook: Hook) => [hook._id, hook.urls]))
        return Object.fromEntries(pairs)
    }

    /**
     * Return array of URLs for specified name.
     *
     * @param  {string} name
     * @returns Promise
     */
    getWebHook = async (name: string): Promise<string[]> => {
        const hook = await HookModel.findById(name)
        if (!hook) throw new NameNotFoundError(`Name(${name}) not found while getWebHook.`)
        return hook.urls
    }

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
