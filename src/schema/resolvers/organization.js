import org from '../classes/organization'
import user from '../classes/user'

export default {
  Query: {
    allOrganizations: (obj, args) => org.getAll(),
    organization: async (obj, args) => {
      await org.isExist(args)
      return await org.get(args)
    }
  },
  Mutation: {
    createOrganization: async (obj, args, context) => {
      return await org.create(args, context)
    },
    deleteOrganization: async (obj, args) => {
      await org.isExist(args)
      return await org.delete(args)
      // await deleteEdges(organization)
    },
    updateOrganization: async (obj, args, context) => {
      return await org.update(args, context)
    }
  },
  Organization: {
    members: (obj, args) => org.members(obj),
    createdBy: (obj, args) => org.createdBy(obj),
    updatedBy: (obj, args) => org.updatedBy(obj),
    // picture: (obj, args, context) => org.picture(obj, context)
  }
}