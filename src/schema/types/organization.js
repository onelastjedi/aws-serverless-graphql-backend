// GraphQL Language Cheat Sheet
// https://raw.githubusercontent.com/sogko/graphql-shorthand-notation-cheat-sheet/master/graphql-shorthand-notation-cheat-sheet.png
export default `
  type Organization {
    _key: ID!
    _id: ID!
    name: String!
    description: String
    address: Address
    phone: String
    website: String
    type: String
    picture: String
    members: [User]
    createdAt: DateTime!
    createdBy: User!
    updatedAt: DateTime!
    updatedBy: User!
  }

  input OrganizationPayload {
    name: String!
    description: String
    address: AddressPayload
    phone: String
    website: String
    type: String
    picture: String
  }

  type Query {
    allOrganizations: [Organization]
    organization(_key: ID!): Organization
  }

  type Mutation {
    createOrganization(data: OrganizationPayload!): Organization
    updateOrganization(_key: ID!, data: OrganizationPayload!): Organization
    deleteOrganization(_key: ID!): Organization
  }
`