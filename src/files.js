import { signedUrl } from './lib/s3'
import { success, failure } from './lib/responses'

const ext = filename => (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined

export const handler = (event, context, callback) => {
  const { email } = event.requestContext.authorizer.claims
  const { Bucket } = process.env
  const { filename, filetype, acl } = event.queryStringParameters
  
  const params = {
    Key: `${email}/${Date.now()}.${ext(filename)[0]}`,
    Bucket: Bucket,
    ACL: acl
  }
  
  try { 
    const url = signedUrl('putObject', params)
    callback(null, success(url))
  } catch (e) {
    callback(null, failure(e))
  }
}