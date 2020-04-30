import { UserObject } from '../routes/models/User'
import webpush from 'web-push'

const sgMail = require('@sendgrid/mail')
import dotenv from 'dotenv'
dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

interface ClassJSON {
    courseReferenceNumber: string
    seatsAvailable: number
}

//* this route is sending email notification and looping over subscription objects to send push notifications
export const notifyUser = async (user: UserObject, classData: any) => {
    // * Cast class data to classJSON interface
    const classJSON = classData as ClassJSON

    // * Determine status message
    const statusMessage = classJSON.seatsAvailable > 0 ? 'OPEN' : 'CLOSED'

    // * Destructure needed elements off of ClassJSON
    const { courseReferenceNumber } = classJSON

    // * If user has email notifications enabled, send email notification
    if (user.emailNotificationsEnabled) {
        try {
            console.log('Attempting to send email to ' + user.email)
            // * Construct email message
            const msg = {
                to: user.email,
                from: process.env.SENDGRID_EMAIL_ADDRESS,
                subject: `TRACKING CLASS CRN ${courseReferenceNumber} HAS STATUS: ${statusMessage}`,
                text: 'Thanks for using Registrum!',
                html: '<strong>Thanks for using Registrum!</strong>'
            }

            // // * SEND EMAIL
            // await sgMail.send(msg)

            console.log('EMAIL SENT TO ' + user.email)
            console.log(msg)
        } catch (err) {
            throw new Error('Error sending email to user')
        }
    }

    if (user.pushNotificationsEnabled) {
        //! FIXME: use env variables here
        // * GCMAPIKey is a cloud messaging id from google cloud console or firebase to help deliver the message
        // * GCMAPIKey must also be declared in manifest.json file as "gcm_sender_id"
        webpush.setGCMAPIKey(process.env.GCMAPI)

        //* 2nd and 3rd arugment are keys generated once by web push only once
        //* 2nd arugment: public key & 3rd arugment: private key for server
        webpush.setVapidDetails(
            process.env.WEBPUSHEMAIL,
            process.env.WEBPUSHPUBLIC,
            process.env.WEBPUSHPRIVATE
        )

        //* loop over subscription objects for the user and send push notifications
        //* database will have collection of subscription objects that represent different browsers they're logged into
        user.subscriptionObjects.forEach(element => {
            webpush.sendNotification(element, 'CRN:' + courseReferenceNumber + ' ' + statusMessage)
        })
    }
}
