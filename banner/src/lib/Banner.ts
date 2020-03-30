import axios, { AxiosInstance } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'

const bannerHost = process.env.BANNER_PROXY || 'https://banner.apps.uillinois.edu'

type SearchProps = {
    courseNumber: string
    startDate?: string
    endDate?: string
    pageOffset?: string
    pageMaxSize?: string
    sortColumn?: string
    sortDirection?: string
}

type SubjectProps = {
    term: string
    searchTerm?: string
}

type SessionProps = SubjectProps
type AttributeProps = SubjectProps
type PartOfTermProps = SubjectProps

export class Banner {
    private _api: AxiosInstance
    private _cookieJar: CookieJar
    private _term: string
    private _subject: string

    private _clearCookie = () => (this._cookieJar = new CookieJar())

    private _getNewCookie = async () => {
        await this._api.get(
            `${bannerHost}/StudentRegistrationSSB/ssb/term/search?
            mode=search&term=${this._term}&studyPath=&studyPathText=&
            startDatepicker=&endDatepicker=&mepCode=2UIC`,
        )
        await this._api.get(`${bannerHost}/StudentRegistrationSSB/ssb/registration/registration`)
    }

    constructor(term: string, subject: string) {
        this._term = term
        this._subject = subject
        this._clearCookie()
        axiosCookieJarSupport(axios)
        this._api = axios.create({ withCredentials: true, jar: this._cookieJar })
    }

    public search = async ({
        courseNumber = '',
        startDate = '',
        endDate = '',
        pageOffset = '0',
        pageMaxSize = '10',
        sortColumn = 'subjectDescription',
        sortDirection = 'asc',
    }: SearchProps) => {
        if (this._cookieJar.getCookiesSync(`${bannerHost}`)) {
            this._clearCookie()
            await this._getNewCookie()
        }
        return (
            await this._api.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/searchResults/searchResults?txt_subject=${this._subject}&txt_courseNumber=${courseNumber}&txt_term=${this._term}&startDatepicker=${startDate}&endDatepicker=${endDate}&pageOffset=${pageOffset}&pageMaxSize=${pageMaxSize}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`,
            )
        ).data
    }

    public static term = async () => {
        return (
            await axios.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/classSearch/getTerms?
                searchTerm=&offset=1&max=1000&mepCode=2UIC`,
            )
        ).data
    }

    public static subject = async ({ term, searchTerm = '' }: SubjectProps) => {
        return (
            await axios.get(
                `${bannerHost}/StudentRegistrationSSB-FED/ssb/classSearch/get_subject?
                searchTerm=${searchTerm}&term=${term}&offset=1&max=1000&mepCode=2UIC`,
            )
        ).data
    }

    public static session = async ({ term, searchTerm = '' }: SessionProps) => {
        return (
            await axios.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/classSearch/get_session?
                searchTerm=${searchTerm}&term=${term}&offset=1&max=1000&mepCode=2UIC`,
            )
        ).data
    }

    public static partOfTerm = async ({ term, searchTerm = '' }: PartOfTermProps) => {
        return (
            await axios.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/classSearch/get_partOfTerm?
                searchTerm=${searchTerm}&term=${term}&offset=1&max=1000&mepCode=2UIC`,
            )
        ).data
    }

    public static attribute = async ({ term, searchTerm = '' }: AttributeProps) => {
        return (
            await axios.get(
                `${bannerHost}/StudentRegistrationSSB/ssb/classSearch/get_attribute?
                searchTerm=${searchTerm}&term=${term}&offset=1&max=1000&mepCode=2UIC`,
            )
        ).data
    }
}
