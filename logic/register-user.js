import db from '../mongo-connection.js'
import bcrypt from 'bcrypt'

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

export default async function registerUser ({ username, password }) {
  const hashPassword = await bcrypt.hash(password, saltRounds)

  const user = {
    username,
    password: hashPassword
  }

  const usersCollection = db.collection('users')

  const result = await usersCollection.insertOne(user)

  const newUser = usersCollection.findOne({ _id: result.insertedId })

  return newUser
}
