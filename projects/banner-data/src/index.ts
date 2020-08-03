import * as dotenv from 'dotenv';
import * as cron from 'node-cron';
import mongoose from 'mongoose';
import { BannerData, BannerDataConfig } from './BannerData';
import { ArgumentParser } from 'argparse';

dotenv.config();

const defaultConfig = {
  now: false,
  cronCourses: '0 * * * *',
  cronDb: '0 0 * * *',
  pageRetryCount: 5,
  pageRetryTime: 5000,
  maxPageSize: 500,
  waitBetweenPages: 100,
  termsToUpdate: 3,
  waitBetweenTerms: 120000
};

const parser = new ArgumentParser({
  addHelp: true
});

parser.addArgument(['--now'], {
  help: `Perform one-off sync immediately. Cannot be used with --cron.\n
        Example: --now`,
  action: 'storeTrue',
  defaultValue: false
});
parser.addArgument(['--cron-db'], {
  help: `Sync schedule in cron syntax. Cannot be used with --now. \
        Default: ${defaultConfig.cronDb}. \
        Example: --cron-db 0 * * * *`,
  type: 'string',
  defaultValue: defaultConfig.cronDb
});
parser.addArgument(['--cron-courses'], {
  help: `Sync schedule in cron syntax. Cannot be used with --now. \
        Default: ${defaultConfig.cronCourses}. \
        Example: --cron-courses 0 * * * *`,
  type: 'string',
  defaultValue: defaultConfig.cronCourses
});
parser.addArgument(['--page-retry-count'], {
  help: `Number of attempts to re-fetch from banner if unsuccessful. \
        Default: ${defaultConfig.pageRetryCount}. \
        Example: --page-retry-count 10`,
  type: 'int',
  defaultValue: defaultConfig.pageRetryCount
});
parser.addArgument(['--page-retry-time'], {
  help: `Number of milliseconds to wait between page request retry if unsuccessful. \
        Default: ${defaultConfig.pageRetryCount}. \
        Example: --page-retry-time 100`,
  type: 'int',
  defaultValue: defaultConfig.pageRetryCount
});
parser.addArgument(['--wait-between-pages'], {
  help: `Number of milliseconds to wait between page requests to banner. \
        Default: ${defaultConfig.waitBetweenPages}. \
        Example: --wait-between-pages 100`,
  type: 'int',
  defaultValue: defaultConfig.waitBetweenPages
});
parser.addArgument(['--wait-between-terms'], {
  help: `Number of milliseconds to wait between term requests to banner. \
        Default: ${defaultConfig.waitBetweenTerms}. \
        Example: --wait-between-terms 100`,
  type: 'int',
  defaultValue: defaultConfig.waitBetweenTerms
});
parser.addArgument(['--max-page-size'], {
  help: `Max page size for banner search requests. \
        Default: ${defaultConfig.maxPageSize}. \
        Example: --max-page-size 100`,
  type: 'int',
  defaultValue: defaultConfig.maxPageSize
});
parser.addArgument(['--terms-to-update'], {
  help: `Number of terms to update in database. \
        Default: ${defaultConfig.termsToUpdate}. \
        Example: --terms-to-update 3`,
  type: 'int',
  defaultValue: defaultConfig.termsToUpdate
});

const args = parser.parseArgs();

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
  } else {
    console.log(`⏲ Scheduling Courses Update Task to run ${config.cronCourses}`);
    cron.schedule(config.cronCourses, bannerData.updateCourses);
    console.log(`⏲ Scheduling DB Update Task to run ${config.cronDb}`);
    cron.schedule(config.cronDb, bannerData.updateDb);
  }
  await mongoose.connection?.close();
};

boot();
