// GraphQL Language Cheat Sheet
// https://raw.githubusercontent.com/sogko/graphql-shorthand-notation-cheat-sheet/master/graphql-shorthand-notation-cheat-sheet.png
export default `
  type User {
    _key: ID!
    _id: ID!
    email: Email!
    name: String!
    title: String
    description: String
    address: Address
    phone: String
    carrier: String
    picture: String
    location: GPS
    memberOf: Organization
    createdAt: DateTime!
    createdBy: User!
    updatedAt: DateTime!
    updatedBy: User!
    # logs: [Log]
    # files: [File]
  }

  input UserPayload {
    name: String!
    title: String
    organization: String
    description: String
    address: AddressPayload
    phone: String
    carrier: String
    picture: String
  }

  type Query {
    allUsers: [User]
    user(_key: ID!): User
  }

  type Mutation {
    createUser(email: Email!, data: UserPayload!): User
    updateUser(_key: ID!, data: UserPayload!): User
    deleteUser(_key: ID!): User
  }
`