import { ObjectId } from 'mongodb'
import { usersCollection } from '../mongo-connection.js'
import { validateFavId, validateUserId } from './helpers/validators.js'

export default async function addFav ({ userId = '', favId = '' }) {
  validateUserId(userId)
  validateFavId(favId)

  const result = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $addToSet: { favs: favId } },
    { returnDocument: 'after' }
  )

  const userUpdated = result.value

  if (!userUpdated) throw new Error(`user not found with id ${userId}`)

  return userUpdated.favs
}
