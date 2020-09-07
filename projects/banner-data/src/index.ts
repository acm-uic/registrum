import { ArgumentParser } from 'argparse';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as cron from 'node-cron';
import { BannerData, BannerDataConfig } from './BannerData';

dotenv.config();

const defaultConfig = {
  now: false,
  cronCourses: '*/5 * * * *',
  cronDb: '0 0 * * *',
  termsToUpdate: 3,
  maxPageSize: 500,
  waitBetweenTerms: 5000
};

const parser = new ArgumentParser({
  add_help: true
});

parser.add_argument('-n', '--now', {
  help: `Perform one-off sync immediately. Cannot be used with --cron.\n
        Example: --now`,
  action: 'storeTrue',
  default: false
});
parser.add_argument('-d', '--cron-db', {
  help: `Sync schedule in cron syntax. Cannot be used with --now. \
        Default: ${defaultConfig.cronDb}. \
        Example: --cron-db 0 0 * * *`,
  type: 'string',
  default: defaultConfig.cronDb
});
parser.add_argument('-c', '--cron-courses', {
  help: `Sync schedule in cron syntax. Cannot be used with --now. \
        Default: ${defaultConfig.cronCourses}. \
        Example: --cron-courses */10 * * * *`,
  type: 'string',
  default: defaultConfig.cronCourses
});
parser.add_argument('-s', '--max-page-size', {
  help: `Max page size for banner search requests. \
        Default: ${defaultConfig.maxPageSize}. \
        Example: --max-page-size 100`,
  type: 'int',
  default: defaultConfig.maxPageSize
});
parser.add_argument('-t', '--terms-to-update', {
  help: `Number of terms to update in database. \
        Default: ${defaultConfig.termsToUpdate}. \
        Example: --terms-to-update 3`,
  type: 'int',
  default: defaultConfig.termsToUpdate
});

const args = parser.parse_args();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/registrum';

type AppConfig = {
  now: boolean;
  cronDb: string;
  cronCourses: string;
  bannerData: BannerDataConfig;
};
const config: AppConfig = {
  now: args.now,
  cronDb: args.cron_db || process.env.BANNER_DATA_DB_REFRESH_INTERVAL,
  cronCourses: args.cron_courses || process.env.BANNER_DATA_COURSES_REFRESH_INTERVAL,
  bannerData: {
    pageRetryCount: args.page_retry_count,
    pageRetryTime: args.page_retry_time,
    maxPageSize: args.max_page_size,
    waitBetweenPages: args.wait_between_pages,
    waitBetweenTerms: args.wait_between_terms,
    termsToUpdate: args.terms_to_update
  }
};

console.log('🛠 Config:', config);

const boot = async () => {
  try {
    console.log(`⚡️ Attempting mongo connection to ${mongoUri}`);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('✅ MongoDB connection successful.');
  } catch (error) {
    console.log('❌ MongoDB connection unsuccessful.');
  }
  const bannerData = new BannerData(config.bannerData);
  if (config.now) {
    console.log('🔥 Performing one-off sync now');
    await bannerData.updateDb();
    await mongoose.connection.close();
  } else {
    console.log(`⏲ Scheduling Courses Update Task to run ${config.cronCourses}`);
    cron.schedule(config.cronCourses, bannerData.updateCourses);
    console.log(`⏲ Scheduling DB Update Task to run ${config.cronDb}`);
    cron.schedule(config.cronDb, bannerData.updateDb);
  }
};

boot();
