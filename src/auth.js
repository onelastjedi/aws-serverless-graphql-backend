import { success, failure, buildResponse } from './lib/responses'
import * as Cognito from './lib/cognito'

const poolData = {
  UserPoolId: process.env.UserPoolId,
  ClientId: process.env.ClientId
}

export const handler = async (event, context, callback) => {
  const { type, email, phone, name, password, session, newPassword, code } = JSON.parse(event.body)

  if (type === 'respond') {
    const params = {
      ChallengeName: 'CUSTOM_CHALLENGE',
      ClientId: poolData.ClientId,
      ChallengeResponses: {
        USERNAME: phone,
        ANSWER: code
      },
      Session: session
    }
    try {
      const res = await Cognito.call('respondToAuthChallenge', params)
      const { IdToken, RefreshToken } = res.AuthenticationResult
        callback(null, success(
          { tokens: { IdToken, RefreshToken } }
        ))
    } catch (e) {
      callback(null, buildResponse(e.statusCode, e))
    }
  }

  if (type === 'create') {
    const params = {
      UserPoolId: process.env.UserPoolId,
      Username: phone,
      DesiredDeliveryMediums: [ 'EMAIL', 'SMS' ],
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'email_verified',
          Value: 'true'
        },
        {
          Name: 'phone_number',
          Value: phone
        },
        {
          Name: 'phone_number_verified',
          Value: 'true'
        },
        {
          Name: 'name',
          Value: name
        }
      ]
    }
    try {
      const res = await Cognito.call('adminCreateUser', params)
      callback(null, success(res))
    } catch (e) {
      callback(null, buildResponse(e.statusCode, e))
    }
  }



  if (type === 'login') {
    const params = {
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: poolData.ClientId,
      AuthParameters: {
        USERNAME: phone
      }
    }
    try {
      const res = await Cognito.call('initiateAuth', params)
      if ('Session' in res) callback(null, success({ session: res.Session }))
      else {
        const { IdToken, RefreshToken } = res.AuthenticationResult
        callback(null, success(
          { tokens: { IdToken, RefreshToken } }
        ))
      }
    } catch (e) {
      callback(null, buildResponse(e.statusCode, e))
    }
  }

  if (type === 'forgot') {
    var params = {
      UserPoolId: poolData.UserPoolId,
      Username: email
    }
    try {
      const res = await Cognito.call('adminResetUserPassword', params)
      callback(null, success(res))
    } catch(e) {
      callback(null, buildResponse(e.statusCode, e))
    }
  }

  if (type === 'reset') {
    var params = {
      ClientId: poolData.ClientId,
      ConfirmationCode: code,
      Password: password,
      Username: email
    }
    try {
      const res = await Cognito.call('confirmForgotPassword', params)
      callback(null, success(res))
    } catch(e) {
      callback(null, buildResponse(e.statusCode, e))
    }
  }

  if (type === 'change') {
    params = {
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      UserPoolId: poolData.UserPoolId,
      ClientId: poolData.ClientId,
      ChallengeResponses: {
        USERNAME: email,
        'NEW_PASSWORD': newPassword
      },
      Session: session
    }
    try {
      const res = await Cognito.call('adminRespondToAuthChallenge', params)
      const { IdToken, RefreshToken } = res.AuthenticationResult
      callback(null, success(
        { tokens: { IdToken, RefreshToken } }
      ))
    } catch (e) {
      callback(null, success(e))
    }
  }
}