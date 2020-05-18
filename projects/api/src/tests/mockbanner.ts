import express, { Request, Response, NextFunction } from 'express'

const courses = [
    { courseNumber: '111', courseReferenceNumber: '111' },
    { courseNumber: '301', courseReferenceNumber: '301' },
    { courseNumber: '401', courseReferenceNumber: '401' }
]
// * Create mock express isntance
const mockApp: express.Application = express()
mockApp.use(express.json())
mockApp.use(express.urlencoded({ extended: true }))
mockApp.get('/banner/subject', (req: Request, res: Response) => res.send(['CS']))
mockApp.get('/banner/term', (req: Request, res: Response) => res.send(['12345']))
mockApp.post('/banner/class', (req: Request, res: Response) => {
    const { subject, courseNumber } = req.body
    console.log(courseNumber)
    if (subject == 'CS' && courseNumber == undefined) {
        res.send(courses)
        return
    } else if (subject == 'CS' && courseNumber != undefined) {
        res.send(courses.filter(course => course.courseNumber == courseNumber))
        return
    }

    res.send([])
})

mockApp.post('/banner/course', (req: Request, res: Response) => {
    const { courseReferenceNumbers } = req.body
    res.send(
        courses.filter(course => courseReferenceNumbers.includes(course.courseReferenceNumber))
    )
})

mockApp.post('/banner/hook', (req: Request, res: Response) => {
    res.send('OK')
})

mockApp.post('/banner/deletehook', (req: Request, res: Response) => {
    res.send('OK')
})

mockApp.use((req: Request, res: Response, next: NextFunction) => {
    console.log('mock banner >>>>  ' + req.url)
    next()
})

export default mockApp
