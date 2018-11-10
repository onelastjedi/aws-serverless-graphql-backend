import { graphqlLambda } from 'apollo-server-lambda'
import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './schema/types/'
import resolvers from './schema/resolvers/'
import u from './schema/classes/user'

const schema = makeExecutableSchema({ typeDefs, resolvers })

export const handler = async (event, context, callback) => {
  const user = await u.logged(event.requestContext.authorizer.claims)
  const callbackFilter = (error, output) => {
    output.headers['Access-Control-Allow-Origin'] = '*' // Required for CORS support to work
    output.headers['Access-Control-Allow-Credentials'] = true // Required for cookies, authorization headers with HTTPS
    callback(error, output)
  }

  const handler = graphqlLambda({
    schema,
    context: {
      user
    }
  })

  return handler(event, context, callbackFilter)
}