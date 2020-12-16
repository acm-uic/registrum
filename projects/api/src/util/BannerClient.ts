import axios, { AxiosInstance } from 'axios';

// * Create Banner Data
export class BannerClient {
  client: AxiosInstance;
  bannerUrl: string;
  constructor(bannerUrl: string) {
    this.bannerUrl = bannerUrl;
    this.client = axios.create({
      baseURL: bannerUrl,
      withCredentials: true
    });
  }
}
