/*
 * File: /src/views/Home.tsx
 * File Created: Wednesday, 11th December 2019 11:28:51 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Sunday, 5th January 2020 4:43:03 pm
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */

import React, { FC } from 'react'
import * as serviceWorker from '../serviceWorker'

const SplashPage: FC = () => {
    async function callServiceWorker() {
        await serviceWorker.registerWithLogin()
    }

    callServiceWorker()

    return <div>SplashPage</div>
}

export default SplashPage
