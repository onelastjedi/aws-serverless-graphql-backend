import { mergeTypes } from 'merge-graphql-schemas'
import scalars from './scalars'
import user from './user'
import organization from './organization'
import address from './address'
import gps from './gps'

export default mergeTypes([scalars, user, organization, address, gps])