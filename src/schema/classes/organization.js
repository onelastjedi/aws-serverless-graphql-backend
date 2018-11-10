import db from '../../lib/db'
import { aql } from 'arangojs'
import * as s3 from '../../lib/s3'
import { isEmpty } from '../../lib/decorators'

class Organization {
  async getAll () {
    try {
      const cursor = await db.query(aql`
        FOR o IN organizations
        RETURN o
      `)
      return cursor.all()
    } catch (err) {
      return err
    }
  }

  async get ({ _key }) {
    try {
      const cursor = await db.query(aql`
        FOR o IN organizations
        FILTER o._key == ${_key}
        RETURN o
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

  async createdBy ({ createdBy }) {
    try {
      const cursor = await db.query(aql`
        FOR u IN users
        FILTER u._id == ${createdBy}
        RETURN u
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

  async updatedBy ({ updatedBy }) {
    try {
      const cursor = await db.query(aql`
        FOR u IN users
        FILTER u._id == ${updatedBy}
        RETURN u
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

  async members ({ _id }) {
    try {
      const cursor = await db.query(aql`
        FOR member IN 1 ANY ${_id}
        GRAPH 'employees'
        RETURN member
      `)
      return cursor.all()
    } catch (err) {
      return err
    }
  }

  async isExist ({ _key }) {
    const cursor = await db.query(aql`
      FOR o IN organizations
      FILTER o._key == ${_key}
      RETURN o
    `)
    if (!cursor.hasNext()) throw new Error('Organization does not exist')
  }

  @isEmpty('name')
  async create (args, context) {
    const { data } = args
    const { user } = context
    try {
      const cursor = await db.query(aql`
        INSERT {
          name: ${data.name},
          address: ${data.address || null},
          phone: ${data.phone || null},
          website: ${data.website || null},
          type: ${data.type || null},
          description: ${data.description || null},
          picture: ${data.picture || null},
          createdAt: DATE_NOW(),
          createdBy: ${user},
          updatedAt: DATE_NOW(),
          updatedBy: ${user}
        } INTO organizations
        RETURN NEW
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

  async update ({ _key, data }, { user }) {
    try {
      const cursor = await db.query(aql`
         FOR o IN organizations
         FILTER o._key == ${_key}
         UPDATE o WITH {
           name: ${data.name},
           address: ${data.address || null},
           phone: ${data.phone || null},
           website: ${data.website || null},
           type: ${data.type || null},
           description: ${data.description || null},
           picture: ${data.picture || null},
           updatedAt: DATE_NOW(),
           updatedBy: ${user}
         } IN organizations
         RETURN NEW
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

  async delete ({ _key }) {
    try {
      const cursor = await db.query(aql`
        FOR o IN organizations
        FILTER o._key == ${_key}
        REMOVE o in organizations
        RETURN OLD
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

  async picture ({ picture }) {
    const { Bucket } = process.env
    const params = {
      Bucket,
      Key: picture
    }
    return s3.sign('getObject', params)
  }
}

export default new Organization()