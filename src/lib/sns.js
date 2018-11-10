import AWS from 'aws-sdk'

export const call = (action, params) => {
  const Sns = new AWS.SNS()
  return Sns[action](params).promise()
}