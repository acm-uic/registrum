import axios from 'axios'
import { store } from '@redux/store'
import { userSignIn } from '@actions/auth'

export const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post(
            '/api/auth/login',
            { email, password },
            { withCredentials: true }
        )

        if (response.status == 200) store.dispatch(userSignIn(response.data, ''))
    } catch (err) {
        store.dispatch(userSignIn(null, err))
    }
}
