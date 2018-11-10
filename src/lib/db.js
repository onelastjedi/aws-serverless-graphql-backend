import { Database, aql } from 'arangojs'

const arango = {
  url: process.env.ArangoURL,
  user: process.env.ArangoUser,
  password: process.env.ArangoPW,
  db: process.env.ArangoDBName
}

export default new Database({
  url: `http://${arango.user}:${arango.password}@${arango.url}`,
  databaseName: arango.db
})