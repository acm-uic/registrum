import { Document, model, Schema, Mongoose } from 'mongoose'
import { Banner, SearchResponse, Course } from './lib/Banner'

const FacultySchema = new Schema({
    bannerId: Number,
    category: String,
    class: String,
    courseReferenceNumber: Number,
    displayName: String,
    emailAddress: String,
    primaryIndicator: Boolean,
    term: Number,
})

const MeetingsFacultySchema = new Schema({
    category: String,
    class: String,
    courseReferenceNumber: String,
    faculty: [FacultySchema],
    meetingTime: {
        beginTime: String,
        building: String,
        buildingDescription: String,
        campus: String,
        campusDescription: String,
        category: String,
        class: String,
        courseReferenceNumber: String,
        creditHourSession: Number,
        endDate: String,
        endTime: String,
        friday: Boolean,
        hoursWeek: Number,
        meetingScheduleType: String,
        monday: Boolean,
        room: String,
        saturday: Boolean,
        startDate: String,
        sunday: Boolean,
        term: String,
        thursday: Boolean,
        tuesday: Boolean,
        wednesday: Boolean,
    },
    term: Number,
})

const CourseSchema = new Schema({
    id: Number,
    term: String,
    termDesc: String,
    courseReferenceNumber: String,
    partOfTerm: String,
    courseNumber: String,
    subject: String,
    subjectDescription: String,
    sequenceNumber: String,
    campusDescription: String,
    scheduleTypeDescription: String,
    courseTitle: String,
    creditHours: String,
    maximumEnrollment: Number,
    enrollment: Number,
    seatsAvailable: Number,
    waitCapacity: Number,
    waitCount: Number,
    waitAvailable: Number,
    crossList: String,
    crossListCapacity: String,
    crossListCount: String,
    crossListAvailable: String,
    creditHourHigh: String,
    creditHourLow: Number,
    creditHourIndicator: String,
    openSection: Boolean,
    linkIdentifier: String,
    isSectionLinked: Boolean,
    subjectCourse: String,
    faculty: [FacultySchema],
    meetingsFaculty: [MeetingsFacultySchema],
})

export type BannerDataConfig = {
    maxPageSize: number;
    waitBetweenPages: number;
    pageRetryCount: number;
    pageRetryTime: number;
}

export class BannerData {
    #db: Mongoose
    #config: BannerDataConfig
    constructor(db: Mongoose, config: BannerDataConfig) {
        this.#db = db
        this.#config = config
    }

    #getAllPages = async (banner: Banner) => {
        const progress = '✨ 🚀 🌮 🧪 🎸 😎 🔫 💩 👽 👾 🤖 💥 🔥 🌈 👻'.split(' ')
        const { maxPageSize, waitBetweenPages } = this.#config
        let count = 0
        const res = await this.#getPage(banner, maxPageSize, 0)
        const { success, totalCount, pageOffset, pageMaxSize, sectionsFetchedCount } = res
        console.log(`${progress[(count++) % progress.length]} ${success}, ${totalCount}, \
${pageOffset}, ${pageMaxSize}, ${sectionsFetchedCount}`)
        let received = res.data.length
        while (received < res.totalCount) {
            const page = await this.#getPage(banner, maxPageSize, received)
            const { success, totalCount, pageOffset, pageMaxSize, sectionsFetchedCount } = page
            console.log(`${progress[(count++) % progress.length]} ${success}, ${totalCount}, \
${pageOffset}, ${pageMaxSize}, ${sectionsFetchedCount}`)
            res.data = [...res.data, ...page.data]
            received += page.data.length
            await new Promise(resolve => setTimeout(resolve, waitBetweenPages))
        }
        return res
    }

    #getPage = async (banner: Banner, size: number, offset: number) => {
        const { pageRetryTime, pageRetryCount } = this.#config
        for (let retryCount = 0; retryCount < pageRetryCount; retryCount++) {
            const res = await banner.search({
                pageMaxSize: `${size}`,
                pageOffset: `${offset}`,
                // TODO: Remove subject filter when sync service is completed
                subject: 'CS'
            })
            if (res.success)
                return res
            console.log('Retrying Page')
            await new Promise(resolve => setTimeout(resolve, pageRetryTime))
        }
    }

    updateDb = async () => {
        const latestTerm = (await Banner.getTerm()).shift()
        console.log(`🚨 Term: ${latestTerm.code}: ${latestTerm.description}`)
        const banner = new Banner(latestTerm.code)
        const res: SearchResponse = await this.#getAllPages(banner)
        const CourseModel = model<Course & Document>('Course', CourseSchema)
        console.log('🗑 Deleting Documents')
        await CourseModel.collection.deleteMany({})
        console.log('✨ Creating Documents')
        await CourseModel.collection.insertMany(res.data)
        console.log('🍕 Sync Completed')
    }
}

export default BannerData
