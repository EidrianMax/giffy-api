import { usersCollection } from '../mongo-connection.js'
import { ObjectId } from 'mongodb'
import { validateUserId } from './helpers/validators.js'

export default async function getAllFavs ({ userId = '' }) {
  validateUserId(userId)

  const user = await usersCollection.findOne({ _id: new ObjectId(userId) })

  if (!user) throw new Error(`user not found with id ${userId}`)

  return user.favs
}
