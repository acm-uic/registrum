import { Banner } from '../lib/Banner'

describe('Banner Lib Test', () => {
    it('Static Operations', async () => {
        jest.setTimeout(10000)
        const terms = await Banner.getTerm()
        const term = terms[0].code
        await Promise.all([
            Banner.getSession({ term }),
            Banner.getSubject({ term }),
            Banner.getAttribute({ term }),
            Banner.getPartOfTerm({ term }),
            Banner.getLatestTerm()
        ])
    })

    it('Course Operations', async () => {
        jest.setTimeout(20000)
        const { code } = await Banner.getLatestTerm()
        const banner = new Banner(code, 'CS')
        const courseReferenceNumber = (await banner.search({ courseNumber: '111' })).data[0]
            .courseReferenceNumber
        await banner.getClassDetails({ courseReferenceNumber })
        await banner.getCourseDescription({ courseReferenceNumber })
        await banner.getSectionAttributes({ courseReferenceNumber })
        await banner.getRestrictions({ courseReferenceNumber })
        await banner.getFacultyMeetingTimes({ courseReferenceNumber })
        await banner.getXlstSections({ courseReferenceNumber })
        await banner.getLinkedSections({ courseReferenceNumber })
        await banner.getFees({ courseReferenceNumber })
        await banner.getSectionBookstoreDetails({ courseReferenceNumber })
    })

    it('Term Operations', async () => {
        jest.setTimeout(5000)
        const { code } = await Banner.getLatestTerm()
        const banner = new Banner(code)
        await banner.search({ courseNumber: '111' })
    })
})
