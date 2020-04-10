import * as dotenv from 'dotenv'
import * as cron from 'node-cron'
import { Mongoose, connect } from 'mongoose'
import { BannerData, BannerDataConfig } from './BannerData'
import { ArgumentParser } from 'argparse'

dotenv.config()

const defaultConfig = {
    now: false,
    cron: '0 0 * * *',
    pageRetryCount: 5,
    pageRetryTime: 5000,
    maxPageSize: 500,
    waitBetweenPages: 100,
}

const parser = new ArgumentParser({
    addHelp: true
})

parser.addArgument(
    ['--now'],
    {
        help: `Perform one-off sync immediately. Cannot be used with --cron.\n
        Example: --now`,
        action: 'storeTrue',
        defaultValue: false
    }
)
parser.addArgument(
    ['--cron'],
    {
        help: `Sync schedule in cron syntax. Cannot be used with --now. \
        Default: ${defaultConfig.cron}. \
        Example: --cron 0 * * * *`,
        type: 'string',
        defaultValue: defaultConfig.cron
    }
)
parser.addArgument(
    ['--page-retry-count'],
    {
        help: `Number of attempts to re-fetch from banner if unsuccessful. \
        Default: ${defaultConfig.pageRetryCount}. \
        Example: --page-retry-count 10`,
        type: 'int',
        defaultValue: defaultConfig.pageRetryCount
    }
)
parser.addArgument(
    ['--page-retry-time'],
    {
        help: `Number of milliseconds to wait between page request retry if unsuccessful. \
        Default: ${defaultConfig.pageRetryCount}. \
        Example: --page-retry-time 100`,
        type: 'int',
        defaultValue: defaultConfig.pageRetryCount

    }
)
parser.addArgument(
    ['--wait-between-pages'],
    {
        help: `Number of milliseconds to wait between page requests to banner. \
        Default: ${defaultConfig.waitBetweenPages}. \
        Example: --wait-between-pages 100`,
        type: 'int',
        defaultValue: defaultConfig.waitBetweenPages

    }
)
parser.addArgument(
    ['--max-page-size'],
    {
        help: `Max page size for banner search requests. \
        Default: ${defaultConfig.maxPageSize}. \
        Example: --max-page-size 100`,
        type: 'int',
        defaultValue: defaultConfig.maxPageSize
    }
)

const args = parser.parseArgs()
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/banner-data'
type AppConfig = {
    now: boolean;
    cron: string;
    bannerData: BannerDataConfig;
}
const config: AppConfig = {
    now: args.now,
    cron: args.cron,
    bannerData: {
        pageRetryCount: args.page_retry_count,
        pageRetryTime: args.page_retry_time,
        maxPageSize: args.max_page_size,
        waitBetweenPages: args.wait_between_pages,
    }
}

console.log('🛠 Config:', config)

const boot = async () => {
    let db: Mongoose
    try {
        db = await connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('✅ MongoDB connection successful.')
    } catch (error) {
        console.log('❌ MongoDB connection unsuccessful.')
    }
    const bannerData = new BannerData(db, config.bannerData)
    if (config.now) {
        console.log('🔥 Performing one-off sync now')
        await bannerData.updateDb()
    }
    else {
        console.log(`⏲ Scheduling Update Task to run ${config.cron}`)
        cron.schedule(config.cron, bannerData.updateDb)
    }
    db.connection.close()
}

boot()
