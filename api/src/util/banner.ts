import axios from 'axios'

// * Create Banner Data client
export const BannerClient = axios.create({
    baseURL: process.env.BANNER_URL || 'http://localhost:4001/banner',
    withCredentials: true
})
