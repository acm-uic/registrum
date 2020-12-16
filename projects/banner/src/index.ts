import 'dotenv/config';
import { App } from './app';

const basePath = process.env.BANNER_BASE_PATH || '/banner';
const port = (process.env.BANNER_PORT && parseInt(process.env.BANNER_PORT)) || 4001;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/registrum';
const serviceName = 'Registrum-Banner';

export const app = new App({
  port,
  basePath,
  mongoUri,
  serviceName
});

if (require.main === module) {
  app.listen();
}
