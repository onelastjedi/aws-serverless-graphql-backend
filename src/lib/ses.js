import AWS from 'aws-sdk'

export const call = (action, params) => {
  const Ses = new AWS.SES()
  return Ses[action](params).promise()
}