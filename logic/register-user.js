import { usersCollection } from '../mongo-connection.js'
import bcrypt from 'bcrypt'
import { validatePassword, validateUsername } from './helpers/validators.js'

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

export default async function registerUser ({ username, password }) {
  validateUsername(username)
  validatePassword(password)

  const user = await usersCollection.findOne({ username })

  if (user) throw new Error(`user with username ${username} already exists`)

  const hashPassword = await bcrypt.hash(password, saltRounds)

  const userToSave = {
    username,
    password: hashPassword,
    favs: []
  }

  const result = await usersCollection.insertOne(userToSave)

  const newUser = await usersCollection.findOne({ _id: result.insertedId })

  return { id: newUser._id, username: newUser.username }
}
