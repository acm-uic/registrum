import { UserObject } from '../routes/models/User'

const sgMail = require('@sendgrid/mail')
import dotenv from 'dotenv'
dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

interface ClassJSON {
  courseReferenceNumber: string;
  seatsAvailable: number;
}
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
        html: '<strong>Thanks for using Registrum!</strong>',
      }

      // // * SEND EMAIL
      // await sgMail.send(msg)

      console.log('EMAIL SENT TO ' + user.email)
      console.log(msg)
    } catch (err) {
      throw new Error('Error sending email to user')
    }
  }
}
