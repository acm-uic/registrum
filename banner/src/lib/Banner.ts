import axios, { AxiosInstance } from "axios"
import axiosCookieJarSupport from "axios-cookiejar-support"
import { CookieJar } from "tough-cookie"
import { URLSearchParams } from "url"

const bannerHost = process.env.BANNER_PROXY || "https://banner.apps.uillinois.edu"

type SearchProps = {
    courseNumber: string;
    startDate?: string;
    endDate?: string;
    pageOffset?: string;
    pageMaxSize?: string;
    sortColumn?: string;
    sortDirection?: string;
}

type GetClassDetailsProps = {
    courseReferenceNumber: string;
    first?: string;
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
    searchTerm?: string;
}

type GetSubjectProps = {
    term: string;
    searchTerm?: string;
}

type GetSessionProps = GetSubjectProps
type GetAttributeProps = GetSubjectProps
type GetPartOfTermProps = GetSubjectProps

export class Banner {
    #api: AxiosInstance
    #cookieJar: CookieJar
    #term: string
    #subject: string

    #clearCookie = () => (this.#cookieJar = new CookieJar())

    #getNewCookie = async () => {
        const params = new URLSearchParams({
            mode: "search",
            term: this.#term,
            studyPath: "",
            studyPathText: "",
            startDatepicker: "",
            endDatepicker: "",
            mepCode: "2UIC",
        })
        await this.#api.get(
            `${bannerHost}/StudentRegistrationSSB/ssb/term/search?${params.toString()}`
        )
        await this.#api.get(`${bannerHost}/StudentRegistrationSSB/ssb/registration/registration`)
    }

    constructor(term: string, subject: string) {
        this.#term = term
        this.#subject = subject
        this.#clearCookie()
        axiosCookieJarSupport(axios)
        this.#api = axios.create({ withCredentials: true, jar: this.#cookieJar })
    }

    search = async ({
        courseNumber = "",
        startDate = "",
        endDate = "",
        pageOffset = "0",
        pageMaxSize = "10",
        sortColumn = "subjectDescription",
        sortDirection = "asc",
    }: SearchProps) => {
        if (this.#cookieJar.getCookiesSync(`${bannerHost}`)) {
            this.#clearCookie()
            await this.#getNewCookie()
        }
        const params = new URLSearchParams({
            txt_subject: this.#subject, // eslint-disable-line @typescript-eslint/camelcase
            txt_courseNumber: courseNumber, // eslint-disable-line @typescript-eslint/camelcase
            txt_term: this.#term, // eslint-disable-line @typescript-eslint/camelcase
            startDatepicker: startDate,
            endDatepicker: endDate,
            pageOffset,
            pageMaxSize,
            sortColumn,
            sortDirection,
        })
        return (
            await this.#api.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/searchResults/searchResults?${params.toString()}`
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
            first: "first",
        })
        return (
            await this.#api.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/searchResults/${operation}?${_params.toString()}`
            )
        ).data
    }

    getClassDetails = async (params: GetClassDetailsProps) => {
        return await this.#courseOperation("getClassDetails", params)
    }
    getCourseDescription = async (params: GetCourseDescriptionProps) => {
        return await this.#courseOperation("getCourseDescription", params)
    }
    getSectionAttributes = async (params: GetSectionAttributesProps) => {
        return await this.#courseOperation("getSectionAttributes", params)
    }
    getRestrictions = async (params: GetRestrictionsProps) => {
        return await this.#courseOperation("getRestrictions", params)
    }
    getFacultyMeetingTimes = async (params: GetFacultyMeetingTimesProps) => {
        return await this.#courseOperation("getFacultyMeetingTimes", params)
    }
    getXlstSections = async (params: GetXlstSectionsProps) => {
        return await this.#courseOperation("getXlstSections", params)
    }
    getLinkedSections = async (params: GetLinkedSectionsProps) => {
        return await this.#courseOperation("getLinkedSections", params)
    }
    getFees = async (params: GetFeesProps) => {
        return await this.#courseOperation("getFees", params)
    }
    getSectionBookstoreDetails = async (params: GetSectionBookstoreDetailsProps) => {
        return await this.#courseOperation("getSectionBookstoreDetails", params)
    }

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
            searchTerm: "",
            offset: "1",
            max: "1000",
            mepCode: "2UIC",
        })
        return (
            await axios.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/classSearch/${operation}?${_params.toString()}`
            )
        ).data
    }

    public static getTerm = async (params: GetTermProps) => {
        return await Banner.staticOperations("getTerms", params)
    }

    public static getSubject = async (params: GetSubjectProps) => {
        return await Banner.staticOperations("get_subject", params)
    }

    public static getSession = async (params: GetSessionProps) => {
        return await Banner.staticOperations("get_session", params)
    }

    public static getPartOfTerm = async (params: GetPartOfTermProps) => {
        return await Banner.staticOperations("get_partOfTerm", params)
    }

    public static getAttribute = async (params: GetAttributeProps) => {
        return await Banner.staticOperations("get_attribute", params)
    }
}
