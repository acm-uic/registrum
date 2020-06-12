import { IUser } from '../interfaces/IUser'
import CourseData from './FakeCourseData.json'

let users: IUser[] = JSON.parse(localStorage.getItem('users') || '[]') || []
console.log(CourseData)
export function configureFakeAPI() {
    const realFetch = window.fetch
    window.fetch = function (url: string, opts?: RequestInit): PromiseLike<Response> {
        const { method, headers } = opts || { method: 'GET', headers: undefined }
        console.log(url, method, headers)
        console.log(url.endsWith('/users'))

        const body = JSON.parse((opts && opts.body?.toString()) || '{}')

        return new Promise((resolve, reject) => {
            // helper functions

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function ok(body?: any) {
                resolve(new Response(JSON.stringify(body), { status: 200 }))
            }

            function unauthorized() {
                resolve(new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 }))
            }

            function error(message: string) {
                resolve(new Response(JSON.stringify({ message }), { status: 400 }))
            }

            function isLoggedIn() {
                return new Headers(headers).get('Authorization') === 'Bearer fake-jwt-token'
            }

            function idFromUrl() {
                const urlParts = url.split('/')
                return parseInt(urlParts[urlParts.length - 1])
            }

            // route functions

            function getCourses() {
                // if (!isLoggedIn()) return unauthorized();
                return ok(CourseData)
            }

            function authenticate() {
                const { email, password } = body
                const user = users.find(x => x.email === email && x.password === password)
                if (!user) return error('Email or password is incorrect')
                return ok({
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: 'fake-jwt-token'
                })
            }

            function register() {
                const user = body

                if (users.find(x => x.email === user.email)) {
                    return error(`Email  ${user.email} is already taken`)
                }

                // assign user id and a few other properties then save
                user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1
                users.push(user)
                localStorage.setItem('users', JSON.stringify(users))

                return ok()
            }

            function getUsers() {
                if (!isLoggedIn()) return unauthorized()

                return ok(users)
            }

            function deleteUser() {
                if (!isLoggedIn()) return unauthorized()

                users = users.filter(x => x.id !== idFromUrl())
                localStorage.setItem('users', JSON.stringify(users))
                return ok()
            }

            function handleRoute() {
                switch (true) {
                    case url.endsWith('/users/authenticate') && method === 'POST':
                        return authenticate()
                    case url.endsWith('/users/register') && method === 'POST':
                        return register()
                    case url.endsWith('/users') && method === 'GET':
                        return getUsers()
                    case url.endsWith('/courses') && method === 'GET':
                        return getCourses()
                    case url.match(/\/users\/\d+$/) && method === 'DELETE':
                        return deleteUser()
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error))
                }
            }

            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500)
        })
    } as typeof window.fetch
}
