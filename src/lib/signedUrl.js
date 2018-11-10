import AWS from 'aws-sdk'

const { Region, Bucket } = process.env

export const call = (action, key) => {
  const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: Region
  })

  return s3.getSignedUrl(action, {
    Bucket: Bucket,
    Key: key
  })
}