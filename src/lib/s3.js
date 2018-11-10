import AWS from 'aws-sdk'

const { Region } = process.env

const s3 = new AWS.S3({ 
  signatureVersion: 'v4', 
  region: Region 
})

export const signedUrl = (action, params) => {
  return s3.getSignedUrl(action, params)
}

export const obj = (action, params) => {
  return s3[action](params).promise()
} 