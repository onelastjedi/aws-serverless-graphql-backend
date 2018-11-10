const mod = require('./../src/auth')
const jestPlugin = require('serverless-jest-plugin')
const lambdaWrapper = jestPlugin.lambdaWrapper
const wrapped = lambdaWrapper.wrap(mod, { handler: 'handler' })

const run = async (body) => {
  return await wrapped.run({body: JSON.stringify(body)})
}

// describe('Login', () => {
//    it('Can login w/ right credentials', async () => {
//     const body = {
//       type: 'login',
//       email: 'tkomarenko@dataharmonix.com',
//       password: 'Asdasd!234'
//     }
//     const res = await run(body)
//     expect(res.statusCode).toEqual(200)
//   })

//   it('Can return error w/ wrong credentials', async () => {
//     const body = {
//       type: 'login',
//       email: 'tkomarenko@dataharmonix.com',
//       password: 'Asdasd!2345'
//     }
//     const res = await run(body)
//     expect(res.statusCode).toEqual(400)
//   })
// })

// describe('Forgot', () => {
//    it('Can call forgot password w/ right credentials', async () => {
//     const body = {
//       type: 'forgot',
//       email: 'tkomarenko@dataharmonix.com',
//     }
//     const res = await run(body)
//     expect(res.statusCode).toEqual(200)
//   })

//   it('Can return error w/ wrong credentials', async () => {
//     const body = {
//       type: 'forgot',
//       email: 'tkomarenko@dataharmonix1.com',
//     }
//     const res = await run(body)
//     console.log(res)
//     expect(res.statusCode).toEqual(400)
//   })
// })

describe('Forgot', () => {
   it('Can call forgot password w/ right credentials', async () => {
    const body = {
      type: 'forgot',
      email: 'tkomarenko@dataharmonix.com',
    }
    const res = await run(body)
    expect(res.statusCode).toEqual(200)
  })

  it('Can return error w/ wrong credentials', async () => {
    const body = {
      type: 'forgot',
      email: 'tkomarenko@dataharmonix1.com',
    }
    const res = await run(body)
    console.log(res)
    expect(res.statusCode).toEqual(400)
  })
})