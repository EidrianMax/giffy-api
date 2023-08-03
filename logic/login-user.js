import db from '../mongo-connection.js'
import bcrypt from 'bcrypt'

export default async function loginUser ({ username, password }) {
  const collection = db.collection('users')

  const user = await collection.findOne({ username })

  if (!user) throw new Error('invalid credentials')

  const isPasswordRigth = await bcrypt.compare(password, user.password)

  if (!isPasswordRigth) throw new Error('invalid credentials')

  return user._id
}
