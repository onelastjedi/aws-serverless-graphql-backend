const mod = require('./../src/files')
const jestPlugin = require('serverless-jest-plugin')
const lambdaWrapper = jestPlugin.lambdaWrapper
const wrapped = lambdaWrapper.wrap(mod, { handler: 'handler' })

let event = {
  requestContext: {
    authorizer: {
      claims: {
        email: 'tkomarenko@dataharmonix.com'
      }
    }
  },
  queryStringParameters: {
    filename: 'test.png',
    filetype: 'image/png',
  }
}

describe('files', () => {
   it('Can return signed url', async () => {
    const res = await wrapped.run(event)
    expect(res.statusCode).toEqual(200)
  })
})