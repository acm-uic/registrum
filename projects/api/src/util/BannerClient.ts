import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'

// * Create Banner Data
export class BannerClient {
    client: AxiosInstance
    bannerUrl: string
    constructor(bannerUrl: string) {
        console.log(`CREATING BANNER CLIENT WITH URI ${bannerUrl}`)
        this.client = axios.create({
            baseURL: bannerUrl,
            withCredentials: true
        })
        this.client.interceptors.request.use((req: AxiosRequestConfig) => {
            console.log(`BANNER REQ >> ${req.url}`)
            return req
        })

        this.client.interceptors.response.use((res: AxiosResponse) => {
            console.log(`BANNER RESPONSE << ${JSON.stringify(res.data)}`)
            return res
        })
    }
}
