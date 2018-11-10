import AWS from 'aws-sdk'

export const call = (action, params) => {
  const Cognito = new AWS.CognitoIdentityServiceProvider({region: 'us-west-2'})
  return Cognito[action](params).promise()
}