import axios from 'axios'

// * Create Banner Data client
export const BannerClient = axios.create({
    baseURL: process.env.BANNER_URL || 'http://banner:4001/',
    withCredentials: true
})
