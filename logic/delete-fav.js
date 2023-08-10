import { usersCollection } from '../mongo-connection.js'
import { ObjectId } from 'mongodb'
import { validateFavId, validateUserId } from './helpers/validators.js'

export default async function deleteFav ({ userId, favId }) {
  validateUserId(userId)
  validateFavId(favId)

  const result = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $pull: { favs: favId } },
    { returnDocument: 'after' }
  )

  const userUpdated = result.value

  if (!userUpdated) throw new Error(`user not found with id ${userId}`)

  return userUpdated.favs
}
