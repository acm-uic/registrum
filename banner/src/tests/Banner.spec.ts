import { Banner } from '../lib/Banner'
import 'mocha'

describe('Banner Lib Test', () => {
    it('Static Operations', async function () {
        this.timeout(10000)
        const terms = await Banner.getTerm()
        const term = terms[0].code
        await Promise.all([
            Banner.getSession({ term }),
            Banner.getSubject({ term }),
            Banner.getAttribute({ term }),
            Banner.getPartOfTerm({ term })
        ])
    })

    it('Course Operations', async function () {
        this.timeout(20000)
        const terms = await Banner.getTerm()
        const term = terms[0].code
        const banner = new Banner(term, 'CS')
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
})
