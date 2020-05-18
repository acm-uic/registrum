import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

// * Create Banner Data
console.log(
    `CREATING BANNER CLIENT WITH URI ${process.env.BANNER_URL || 'http://localhost:4001/banner'}`
)
export const BannerClient = axios.create({
    baseURL: process.env.BANNER_URL || 'http://localhost:4001/banner',
    withCredentials: true
})

BannerClient.interceptors.request.use((req: AxiosRequestConfig) => {
    console.log(`BANNER REQ >> ${req.url}`)
    return req
})

BannerClient.interceptors.response.use((res: AxiosResponse) => {
    console.log(`BANNER RESPONSE << ${JSON.stringify(res.data)}`)
    return res
})
