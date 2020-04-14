export interface Faculty {
    displayName: string
}

export interface Class {
    courseReferenceNumber: string
    _id: string
    id: number
    subject: string
    subjectDescription: string
    campusDescription: string
    scheduleTypeDescription: string
    creditHours: string
    seatsAvailable: number
    enrollment: number
    maximumEnrollment: number
    faculty: Faculty[]
    term: string
    courseTitle: string
    courseNumber: string
}
