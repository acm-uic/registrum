import { WebHooks, HookModel } from '../lib/WebHooks'
import * as chai from 'chai'
import * as mongoose from 'mongoose'
import * as http from 'http'
const { assert } = chai

describe('WebHooks Test', () => {
    const clearDb = async () => {
        await HookModel.remove({})
    }

    const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) => {
        const { headers, method, url } = request
        const buffer: Uint8Array[] = []
        request
            .on('error', err => {
                console.error(err)
            })
            .on('data', chunk => {
                buffer.push(chunk)
            })
            .on('end', () => {
                const body = Buffer.concat(buffer).toString()
                response.on('error', err => {
                    console.error(err)
                })
                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ headers, method, url, body }))
            })
    }

    const server = http.createServer(requestHandler)
    let port: number
    const protocol = 'http'
    let host: string
    let baseUrl: string
    beforeAll(async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/registrum', {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
            console.log('Mongoose connected')
        } catch (e) {
            console.error('Mongoose Error')
            mongoose.disconnect()
            process.exit(1)
        }
        server.listen(0)
        port = await new Promise(resolve => {
            server.on('listening', () => {
                const addressInfo = server.address().valueOf() as {
                    address: string
                    family: string
                    port: number
                }
                resolve(addressInfo.port)
            })
        })
        host = `localhost:${port}`
        baseUrl = `${protocol}://${host}`
        await clearDb()
    })
    afterEach(async () => {
        await clearDb()
    })
    afterAll(async () => {
        mongoose.disconnect()
        server.close()
    })

    it('test remove', async () => {
        const name = 'testRemove'
        const urls = [
            '/testRemove/123',
            '/testRemove/1235',
            '/testRemove/1236',
            '/testRemove/12367',
            '/testRemove/12368',
            '/testRemove/12369'
        ]
        const truth = urls.map(url => `${baseUrl}${url}`)
        await HookModel.create({
            _id: name,
            urls: truth
        })
        const webHooks = new WebHooks({ mongooseConnection: mongoose.connection })
        const removedUrl = truth.pop()
        await webHooks.remove(name, removedUrl)
        await webHooks.remove(name, truth.pop())
        const dbValue = (await HookModel.findById(name)).urls
        assert.deepEqual(dbValue, truth)
        try {
            await webHooks.remove(name, removedUrl)
            assert.fail()
        } catch (e) {
            assert.equal(
                e.message,
                `URL(${removedUrl}) not found wile removing from Name(${name}).`
            )
        }
        await webHooks.remove(name)
        const hook = await HookModel.findById(name)
        const dbExists = !!hook
        assert.equal(dbExists, false)
        try {
            await webHooks.remove(name)
            assert.fail()
        } catch (e) {
            assert.equal(e.message, `Name(${name}) not found while removing.`)
        }
        const badName = 'testRemove-bad'
        try {
            await webHooks.remove(badName, removedUrl)
            assert.fail()
        } catch (e) {
            assert.equal(e.message, `Name(${badName}) not found while removing.`)
        }
        try {
            await webHooks.remove(badName)
            assert.fail()
        } catch (e) {
            assert.equal(e.message, `Name(${badName}) not found while removing.`)
        }
    })

    it('test add', async () => {
        const webHooks = new WebHooks({ mongooseConnection: mongoose.connection })
        const name = 'testAdd'
        const urls = ['/testAdd/123', '/testAdd/1235', '/testAdd/1236']
        const truth = urls.map(url => `${baseUrl}${url}`)
        for (const i in truth) {
            await webHooks.add(name, truth[i])
        }
        const dbValue = (await HookModel.findById(name)).urls
        assert.deepEqual(dbValue, truth)
        try {
            await webHooks.add(name, truth[0])
            assert.fail()
        } catch (e) {
            assert.equal(e.message, `URL(${truth[0]}) already exists for name(${name}).`)
        }
    })

    it('test getWebHook', async () => {
        const name = 'testGetWebHook'
        const urls = ['/testGetWebHook/123', '/testGetWebHook/1235', '/testGetWebHook/1236']
        const truth = urls.map(url => `${baseUrl}${url}`)
        await HookModel.create({
            _id: name,
            urls: truth
        })
        const webHooks = new WebHooks({ mongooseConnection: mongoose.connection })
        const getWebHookResponse = await webHooks.getWebHook(name)
        assert.deepEqual(getWebHookResponse, truth)
        const badName = 'testGetWebHook-bad'
        try {
            await webHooks.getWebHook(badName)
            assert.fail()
        } catch (e) {
            assert.equal(e.message, `Name(${badName}) not found while getWebHook.`)
        }
    })

    it('test get requestFunctions', () => {
        const webHooks = new WebHooks({ mongooseConnection: mongoose.connection })
        const { requestFunctions } = webHooks
        assert.typeOf(requestFunctions, 'object')
    })

    it('test getDB', async () => {
        const db = {
            getDB2: [
                `${baseUrl}testGetDB2/123`,
                `${baseUrl}testGetDB2/1234`,
                `${baseUrl}testGetDB2/1235`
            ],
            getDB1: [
                `${baseUrl}testGetDB/123`,
                `${baseUrl}testGetDB/1234`,
                `${baseUrl}testGetDB/1235`
            ]
        }
        const values = Object.values(db)
        const keys = Object.keys(db)
        for (const i in keys) {
            await HookModel.create({
                _id: keys[i],
                urls: values[i]
            })
        }
        const webHooks = new WebHooks({ mongooseConnection: mongoose.connection })
        const val = await webHooks.getDB()
        assert.deepEqual(val, db)
    })

    it('test trigger', async function () {
        const data = { data: 123123123 }
        const body = JSON.stringify(data)
        const status = 200
        const headerData: { [key: string]: string } = {
            custom: 'data'
        }
        const name = 'testTrigger'
        const url = '/testTrigger/123'
        await HookModel.create({
            _id: name,
            urls: [`${baseUrl}${url}`]
        })

        const webHooks = new WebHooks({ mongooseConnection: mongoose.connection })
        await new Promise(resolve => setTimeout(resolve, 100))
        await new Promise(resolve => {
            webHooks.emitter.on(
                `${name}.status`,
                (nameReceived: string, statusReceived: number, bodyReceived: string) => {
                    assert.equal(statusReceived, status)
                    assert.equal(nameReceived, name)

                    const parsed = JSON.parse(bodyReceived)

                    assert.equal(parsed.body, body)
                    assert.equal(parsed.method, 'POST')
                    assert.equal(parsed.url, url)
                    assert.equal(parsed.headers['content-type'], 'application/json')
                    assert.equal(parsed.headers['content-length'], body.length.toString())

                    Object.keys(headerData).forEach(key => {
                        assert.equal(parsed.headers[key], headerData[key])
                    })

                    resolve()
                }
            )
            webHooks.trigger(name, data, headerData)
        })
    })
})
