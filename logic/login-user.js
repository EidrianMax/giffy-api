import { usersCollection } from '../mongo-connection.js'
import bcrypt from 'bcrypt'
import { validatePassword, validateUsername } from './helpers/validators.js'

export default async function loginUser ({ username, password }) {
  validateUsername(username)
  validatePassword(password)

  const user = await usersCollection.findOne({ username })

  if (!user) throw new Error('invalid credentials')

  const isPasswordRigth = await bcrypt.compare(password, user.password)

  if (!isPasswordRigth) throw new Error('invalid credentials')

  return user._id.toString()
}
