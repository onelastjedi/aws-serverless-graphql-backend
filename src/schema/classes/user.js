import * as Cognito from '../../lib/cognito'
import db from '../../lib/db'
import { aql } from 'arangojs'
import * as s3 from '../../lib/s3'
import { isEmpty } from '../../lib/decorators'

class User {
  @isEmpty('name')
  async createCognitoUser (args) {
    const { name, email } = args.data
    const params = {
      UserPoolId: process.env.UserPoolId,
      Username: email,
      DesiredDeliveryMediums: [ "EMAIL" ],
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'email_verified',
          Value: 'true'
        },
        {
          Name: 'custom:name',
          Value: name
        }
      ]
    }

    await Cognito.call('adminCreateUser', params)
  }

  @isEmpty('name')
  async create (args, context) {
    const { email } = args
    const { name, title, description,
            address, phone, carrier, picture } = args.data

    const { user } = context
    try {
      const cursor = await db.query(aql`
        INSERT {
          email: ${email},
          name: ${name},
          title: ${title || null},
          description: ${description || null},
          address: ${address || { formatted_address: null, line_2: null }},
          phone: ${phone || null},
          carrier: ${carrier || null},
          picture: ${picture || null},
          createdAt: DATE_NOW(),
          createdBy: ${user},
          updatedAt: DATE_NOW(),
          updatedBy: ${user}
        } INTO users
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
        FOR u IN users
        FILTER u._key == ${_key}
        UPDATE u WITH {
          name: ${data.name},
          title: ${data.title || null},
          description: ${data.description || null},
          address: ${data.address || {}},
          phone: ${data.phone || null},
          carrier: ${data.carrier || null},
          picture: ${data.picture || null},
          createdAt: DATE_NOW(),
          createdBy: ${user},
          updatedAt: DATE_NOW(),
          updatedBy: ${user}
        } IN users
        RETURN NEW
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

  async deleteCognitoUser ({ email }) {
    const params = {
        UserPoolId: process.env.UserPoolId,
        Username: email
    }
    try {
      await Cognito.call('adminDeleteUser', params)
    } catch (e) {
      return e
    }
  }

  async delete ({ _key }) {
    try {
      const cursor = await db.query(aql`
        FOR u IN users
        FILTER u._key == ${_key}
        REMOVE u in users
        RETURN OLD
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

  async addEdges (args, arangoUser) {
    const { organization } = args.data
    const { _id } = arangoUser
    try {
      await db.query(aql`
        INSERT {
          _from: ${organization},
          _to: ${_id}
        } INTO employees
      `)
    } catch (err) {
      return err
    }
  }

  async updateEdges ({ _id }, { data: { organization } }) {
    try {
      await db.query(aql`
        UPSERT { _to: ${_id} }
        INSERT { _from: ${organization}, _to: ${_id} }
        UPDATE { _from: ${organization}, _to: ${_id} } IN employees
      `)
    } catch (err) {
      return err
    }
  }

  async deleteEdges ({ _key }) {
    try {
      await db.query(aql`
        FOR edge IN employees
        FILTER edge._to == CONCAT('users/', ${_key})
        REMOVE edge IN employees
        RETURN OLD
      `)
    } catch (err) {
      return err
    }
  }

  async logged ({ email }) {
    try {
      const cursor = await db.query(aql`
        FOR u IN users
        FILTER u.email == ${email}
        RETURN u._id
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

  async get ({ _key }) {
    try {
      const cursor = await db.query(aql`
        FOR u IN users
        FILTER u._key == ${_key}
        RETURN u
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

  async all () {
    try {
      const cursor = await db.query(aql`
        FOR u IN users
        RETURN u
      `)
      return cursor.all()
    } catch (err) {
      return err
    }
  }

  async memberOf ({ _id }) {
    try {
      const cursor = await db.query(aql`
        FOR member IN 1 ANY ${_id}
        GRAPH 'employees'
        RETURN member
      `)
      return cursor.next()
    } catch (err) {
      return err
    }
  }

   async isExist ({ _key }) {
    const cursor = await db.query(aql`
      FOR u IN users
      FILTER u._key == ${_key}
      RETURN u
    `)
    if (!cursor.hasNext()) throw new Error('User does not exist')
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

  picture ({ picture }) {
    const { Bucket } = process.env
    const params = {
      Bucket,
      Key: picture
    }
    return s3.call('getObject', params)
  }
}

export default new User()