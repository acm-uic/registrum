import axios, { AxiosInstance } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { URLSearchParams } from 'url'

const bannerHost = process.env.BANNER_PROXY || 'https://banner.apps.uillinois.edu'

type SearchProps = {
    courseNumber?: string
    subject?: string
    startDate?: string
    endDate?: string
    pageOffset?: string
    pageMaxSize?: string
    sortColumn?: string
    sortDirection?: string
}

type GetClassDetailsProps = {
    courseReferenceNumber: string
    first?: string
}
type GetCourseDescriptionProps = GetClassDetailsProps
type GetSectionAttributesProps = GetClassDetailsProps
type GetRestrictionsProps = GetClassDetailsProps
type GetFacultyMeetingTimesProps = GetClassDetailsProps
type GetXlstSectionsProps = GetClassDetailsProps
type GetLinkedSectionsProps = GetClassDetailsProps
type GetFeesProps = GetClassDetailsProps
type GetSectionBookstoreDetailsProps = GetClassDetailsProps

type GetTermProps = {
    searchTerm?: string
}

type GetSubjectProps = {
    term: string
    searchTerm?: string
}

type GetSessionProps = GetSubjectProps
type GetAttributeProps = GetSubjectProps
type GetPartOfTermProps = GetSubjectProps

export type SearchResponse = {
    success: boolean
    totalCount: number
    data: Course[]
    pageOffset: number
    pageMaxSize: number
    sectionsFetchedCount: number
    pathMode: string
    searchResultsConfigs: {
        config: string
        display: string
        title: string
        width: string
    }[]
}

export type Faculty = {
    bannerId: number
    category: string | null
    class: string
    courseReferenceNumber: number
    displayName: string
    emailAddress: string
    primaryIndicator: boolean
    term: number
}

export type MeetingsFaculty = {
    category: string
    class: string
    courseReferenceNumber: string
    faculty: []
    meetingTime: {
        beginTime: string
        building: string
        buildingDescription: string
        campus: string
        campusDescription: string
        category: string
        class: string
        courseReferenceNumber: string
        creditHourSession: number
        endDate: string
        endTime: string
        friday: boolean
        hoursWeek: number
        meetingScheduleType: string
        monday: boolean
        room: string
        saturday: boolean
        startDate: string
        sunday: boolean
        term: string
        thursday: boolean
        tuesday: boolean
        wednesday: boolean
    }
    term: number
}

export type Course = {
    id: number
    term: string
    termDesc: string
    courseReferenceNumber: string
    partOfTerm: string
    courseNumber: string
    subject: string
    subjectDescription: string
    sequenceNumber: string
    campusDescription: string
    scheduleTypeDescription: string
    courseTitle: string
    creditHours: string | null
    maximumEnrollment: number
    enrollment: number
    seatsAvailable: number
    waitCapacity: number
    waitCount: number
    waitAvailable: number
    crossList: string | null
    crossListCapacity: string | null
    crossListCount: string | null
    crossListAvailable: string | null
    creditHourHigh: string | null
    creditHourLow: number
    creditHourIndicator: string | null
    openSection: boolean
    linkIdentifier: string | null
    isSectionLinked: boolean
    subjectCourse: string
    faculty: Faculty[]
    meetingsFaculty: MeetingsFaculty[]
}

export type Term = {
    code: string
    description: string
}

export type Subject = Term

export type GetTermResponse = Term[]
export type GetSubjectResponse = Subject[]

export class Banner {
    #api: AxiosInstance
    #cookieJar: CookieJar
    #term: string
    #subject: string

    #clearCookie = () => (this.#cookieJar = new CookieJar())

    #getNewCookie = async () => {
        const params = new URLSearchParams({
            mode: 'search',
            term: this.#term,
            studyPath: '',
            studyPathText: '',
            startDatepicker: '',
            endDatepicker: '',
            mepCode: '2UIC'
        })
        await this.#api.get(
            `${bannerHost}/StudentRegistrationSSB/ssb/term/search?${params.toString()}`
        )
        await this.#api.get(`${bannerHost}/StudentRegistrationSSB/ssb/registration/registration`)
    }

    constructor(term: string, subject?: string) {
        this.#term = term
        this.#subject = subject || ''
        this.#clearCookie()
        axiosCookieJarSupport(axios)
        this.#api = axios.create({ withCredentials: true, jar: this.#cookieJar })
    }

    search = async ({
        courseNumber = '',
        subject = '',
        startDate = '',
        endDate = '',
        pageOffset = '0',
        pageMaxSize = '10',
        sortColumn = 'subjectDescription',
        sortDirection = 'asc'
    }: SearchProps): Promise<SearchResponse> => {
        if (this.#cookieJar.getCookiesSync(`${bannerHost}`)) {
            this.#clearCookie()
            await this.#getNewCookie()
        }
        const params = new URLSearchParams({
            /* eslint-disable @typescript-eslint/camelcase */
            txt_subject: subject || this.#subject,
            txt_courseNumber: courseNumber,
            txt_term: this.#term,
            /* eslint-enable @typescript-eslint/camelcase */
            startDatepicker: startDate,
            endDatepicker: endDate,
            pageOffset,
            pageMaxSize,
            sortColumn,
            sortDirection
        })
        return (
            await this.#api.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/searchResults/\
                searchResults?${params.toString()}`
            )
        ).data
    }

    #courseOperation = async (
        operation: string,
        params:
            | GetClassDetailsProps
            | GetCourseDescriptionProps
            | GetSectionAttributesProps
            | GetRestrictionsProps
            | GetFacultyMeetingTimesProps
            | GetXlstSectionsProps
            | GetLinkedSectionsProps
            | GetFeesProps
            | GetSectionBookstoreDetailsProps
    ) => {
        if (this.#cookieJar.getCookiesSync(`${bannerHost}`)) {
            this.#clearCookie()
            await this.#getNewCookie()
        }
        const _params = new URLSearchParams({
            ...params,
            term: this.#term,
            first: 'first'
        })
        return (
            await this.#api.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/searchResults/${operation}?${_params.toString()}`
            )
        ).data
    }

    getClassDetails = async (params: GetClassDetailsProps) =>
        await this.#courseOperation('getClassDetails', params)
    getCourseDescription = async (params: GetCourseDescriptionProps) =>
        await this.#courseOperation('getCourseDescription', params)
    getSectionAttributes = async (params: GetSectionAttributesProps) =>
        await this.#courseOperation('getSectionAttributes', params)
    getRestrictions = async (params: GetRestrictionsProps) =>
        await this.#courseOperation('getRestrictions', params)
    getFacultyMeetingTimes = async (params: GetFacultyMeetingTimesProps) =>
        await this.#courseOperation('getFacultyMeetingTimes', params)
    getXlstSections = async (params: GetXlstSectionsProps) =>
        await this.#courseOperation('getXlstSections', params)
    getLinkedSections = async (params: GetLinkedSectionsProps) =>
        await this.#courseOperation('getLinkedSections', params)
    getFees = async (params: GetFeesProps) => await this.#courseOperation('getFees', params)
    getSectionBookstoreDetails = async (params: GetSectionBookstoreDetailsProps) =>
        await this.#courseOperation('getSectionBookstoreDetails', params)

    private static staticOperations = async (
        operation: string,
        params?:
            | GetTermProps
            | GetSubjectProps
            | GetSessionProps
            | GetPartOfTermProps
            | GetAttributeProps
    ) => {
        const _params = new URLSearchParams({
            ...params,
            searchTerm: '',
            offset: '1',
            max: '1000',
            mepCode: '2UIC'
        })
        return (
            await axios.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/classSearch/${operation}?${_params.toString()}`
            )
        ).data
    }

    public static getLatestTerm = async (): Promise<Term> =>
        (await Banner.getTerm()).reduce((prev, term) =>
            parseInt(term.code) > parseInt(prev.code) ? term : prev
        )
    public static getTerm = async (params?: GetTermProps): Promise<GetTermResponse> =>
        await Banner.staticOperations('getTerms', params)
    public static getSubject = async (params: GetSubjectProps): Promise<GetSubjectResponse> =>
        await Banner.staticOperations('get_subject', params)
    public static getSession = async (params: GetSessionProps) =>
        await Banner.staticOperations('get_session', params)
    public static getPartOfTerm = async (params: GetPartOfTermProps) =>
        await Banner.staticOperations('get_partOfTerm', params)
    public static getAttribute = async (params: GetAttributeProps) =>
        await Banner.staticOperations('get_attribute', params)
}

export default Banner
