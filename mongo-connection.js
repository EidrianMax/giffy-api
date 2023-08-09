import { MongoClient } from 'mongodb'

const { NODE_ENV, MONGO_DB_URI } = process.env

const client = new MongoClient(MONGO_DB_URI)

let connection

try {
  connection = await client.connect()
} catch (e) {
  console.error(e)
}

const db = NODE_ENV === 'test'
  ? connection.db('giffy-test')
  : connection.db('giffy')

const usersCollection = db.collection('users')

export {
  client,
  db,
  usersCollection
}
