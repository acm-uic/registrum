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
        const courseReferenceNumber = (await banner.search({ courseNumber: '111' }))
            .data[0].courseReferenceNumber
        await Promise.all([
            banner.getClassDetails({ courseReferenceNumber }),
            banner.getCourseDescription({ courseReferenceNumber }),
            banner.getSectionAttributes({ courseReferenceNumber }),
        ])
        await Promise.all([
            banner.getRestrictions({ courseReferenceNumber }),
            banner.getFacultyMeetingTimes({ courseReferenceNumber }),
            banner.getXlstSections({ courseReferenceNumber }),
        ])
        await Promise.all([
            banner.getLinkedSections({ courseReferenceNumber }),
            banner.getFees({ courseReferenceNumber }),
            banner.getSectionBookstoreDetails({ courseReferenceNumber }),
        ])
    })
})
