import { Banner } from "./Banner"

const b = new Banner("220208", "CS")

const test = async () => {
    // await b.search({ courseNumber: '494' })
    // const a = await b.courseOperation('getClassDetails', { courseReferenceNumber: '43965' })
    // const a = (await b.search({ courseNumber: '' })).data
    const a = await Banner.getSubject({ term: "220208" })
    console.log(a)
}

test()
