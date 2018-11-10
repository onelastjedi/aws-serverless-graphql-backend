import { buildResponse } from './lib/responses'
import * as Ses from './lib/ses'
import * as Sns from './lib/sns'

exports.handler = (event, context, callback) => {
  if (event.request.session.length === 0 && event.request.challengeName === 'CUSTOM_CHALLENGE') {
    // Create code for sms
    const smsCode = Math.random().toString(10).substr(2, 6)

    // Send the code via Amazon SNS Global SMS
    const smsParams = {
      Message: smsCode + ' is your DHC login code',
      PhoneNumber: event.request.userAttributes.phone_number
    }

    try {
      Sns.call('publish', smsParams)
      console.log(smsCode)
    } catch (e) {
      callback(null, buildResponse(e.statusCode, e))
    }

    // Create token for email
    const emailToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Send the token via Amazon SES
    const params = {
      Destination: {
        ToAddresses: [event.request.userAttributes.email]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data:
              `Login with this link and code from your phone: <a href="${process.env.AppUrl}verify?emailToken=${emailToken}">login</a>`
          },
          Text: {
            Charset: 'UTF-8',
            Data: `Login with this link and code from your phone: ${process.env.AppUrl}verify?emailToken=${emailToken}`
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Login to DHC App'
        }
      },
      ReturnPath: 'mi3ta@sent.as',
      Source: 'mi3ta@sent.as'
    }

    try {
      Ses.call('sendEmail', params)
    } catch (e) {
      callback(null, buildResponse(e.statusCode, e))
    }

    // Set the return parameters, including the correct answer
    event.response.publicChallengeParameters = {}
    event.response.privateChallengeParameters = {}
    event.response.privateChallengeParameters.answer = emailToken.concat(smsCode)
    event.response.challengeMetadata = 'PASSWORDLESS_CHALLENGE'
  }
  callback(null, event)
}