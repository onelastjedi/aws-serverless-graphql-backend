import db from '../../lib/db'
import user from '../classes/user'

export default {
  Query: {
    allUsers: (obj, args) => user.all(),
    user: async (obj, args) => {
      await user.isExist(args)
      return await user.get(args)
    }
  },
  Mutation: {
    createUser: async (obj, args, context) => {
      await user.createCognitoUser(args)
      const arangoUser = await user.create(args, context)
      await user.addEdges(args, arangoUser)
      return arangoUser
    },
    deleteUser: async (obj, args) => {
      const arangoUser = await user.delete(args)
      await user.deleteCognitoUser(arangoUser)
      await user.deleteEdges(args)
      return arangoUser
      // await userExist(args)
    },
    updateUser: async (obj, args, context) => {
      const arangoUser = await user.update(args, context)
      await user.updateEdges(arangoUser, args)
      return arangoUser
    }
  },
  User: {
    memberOf: (obj, args) => user.memberOf(obj),
    createdBy: (obj, args) => user.createdBy(obj),
    updatedBy: (obj, args) => user.updatedBy(obj),
    // picture: (obj, args) => user.picture(obj)
  }
}
