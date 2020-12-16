import 'dotenv/config';
import { App } from './App';

const basePath = process.env.API_BASE_PATH || '/api';
const apiHost = process.env.API_HOST || 'http://localhost:4000';
const bannerUrl = process.env.BANNER_URL || 'http://localhost:4001/banner';
const port = (process.env.API_PORT && parseInt(process.env.API_PORT)) || 4000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/registrum';
const serviceName = 'Registrum-API';

export const app = new App({
  port,
  basePath,
  mongoUri,
  serviceName,
  apiHost,
  bannerUrl
});

if (require.main === module) {
  app.listen();
}
