// http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html
// https://tools.ietf.org/html/rfc7517
import { rsaPublicKeyToPEM } from './rsa-to-pem'
import jwt from 'jsonwebtoken' 
import request from 'request-promise'

export const decodeToken = async (encodedToken) => {  
  const { header: { kid } } = jwt.decode(encodedToken, { complete: true })
  const res = await request(`https://cognito-idp.${process.env.Region}.amazonaws.com/${process.env.UserPoolId}/.well-known/jwks.json`)
  const { keys } = JSON.parse(res)
  const { n, e } = keys.find(o => o.kid === kid)
  jwt.verify(encodedToken, rsaPublicKeyToPEM(n, e))  
}