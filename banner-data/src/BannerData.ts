import { Banner, SearchResponse, Course, Subject, Term } from 'registrum-banner/dist/lib/Banner'
import { CourseSchema, SubjectSchema, TermSchema } from 'registrum-banner/dist/interfaces/Schemas'
import { Document, model } from 'mongoose'
export const TermModel = model<Term & Document>('Term', TermSchema)
export const SubjectModel = model<Subject & Document>('Subject', SubjectSchema)
export const CourseModel = model<Course & Document>('Course', CourseSchema)

export type BannerDataConfig = {
    maxPageSize: number
    waitBetweenPages: number
    pageRetryCount: number
    pageRetryTime: number
}

export class BannerData {
    #config: BannerDataConfig
    constructor(config: BannerDataConfig) {
        this.#config = config
    }

    #getAllPages = async (banner: Banner) => {
        const progress = '✨ 🚀 🌮 🧪 🎸 😎 🔫 💩 👽 👾 🤖 💥 🔥 🌈 👻'.split(' ')
        const { maxPageSize, waitBetweenPages } = this.#config
        let count = 0
        const res = await this.#getPage(banner, maxPageSize, 0)
        const { success, totalCount, pageOffset, pageMaxSize, sectionsFetchedCount } = res
        console.log(`${progress[count++ % progress.length]} ${success}, ${totalCount}, \
${pageOffset}, ${pageMaxSize}, ${sectionsFetchedCount}`)
        let received = res.data.length
        while (received < res.totalCount) {
            const page = await this.#getPage(banner, maxPageSize, received)
            const { success, totalCount, pageOffset, pageMaxSize, sectionsFetchedCount } = page
            console.log(`${progress[count++ % progress.length]} ${success}, ${totalCount}, \
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
                subject: 'CS'
            })
            if (res.success) return res
            console.log('Retrying Page')
            await new Promise(resolve => setTimeout(resolve, pageRetryTime))
        }
    }
    updateTerms = async () => {
        const terms = await Banner.getTerm()
        const res = terms.map(term => {
            return {
                ...term,
                _id: term.code
            }
        })
        await TermModel.collection.bulkWrite(
            res.map(r => {
                return {
                    updateOne: {
                        filter: {
                            _id: r._id
                        },
                        update: r,
                        upsert: true
                    }
                }
            })
        )
    }

    updateSubjects = async () => {
        const subjects = await Banner.getSubject({ term: (await Banner.getLatestTerm()).code })
        const res = subjects.map(subject => {
            return {
                ...subject,
                _id: subject.code
            }
        })
        await SubjectModel.collection.bulkWrite(
            res.map(r => {
                return {
                    updateOne: {
                        filter: {
                            _id: r._id
                        },
                        update: r,
                        upsert: true
                    }
                }
            })
        )
    }

    updateCourses = async () => {
        const banner = new Banner((await Banner.getLatestTerm()).code)
        const courses: SearchResponse = await this.#getAllPages(banner)
        const res = courses.data.map(course => {
            return {
                ...course,
                _id: course.courseReferenceNumber
            }
        })
        await CourseModel.collection.bulkWrite(
            res.map(r => {
                return {
                    updateOne: {
                        filter: {
                            _id: r._id
                        },
                        update: r,
                        upsert: true
                    }
                }
            })
        )
    }

    updateDb = async () => {
        console.log('Updating Subjects')
        await this.updateSubjects()
        console.log('Updating Terms')
        await this.updateTerms()
        console.log('Updating Subjects')
        await this.updateCourses()
    }
}

export default BannerData
