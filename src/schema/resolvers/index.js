import { mergeResolvers } from 'merge-graphql-schemas'
import scalars from './scalars'
import user from './user'
import organization from './organization'

export default mergeResolvers([scalars, user, organization])