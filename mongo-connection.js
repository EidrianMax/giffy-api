import { MongoClient } from 'mongodb'

const connectionString = process.env.MONGO_DB_URI

const client = new MongoClient(connectionString)

let connection

try {
  connection = await client.connect()
} catch (e) {
  console.error(e)
}

const db = connection.db('giffy')

export default db
