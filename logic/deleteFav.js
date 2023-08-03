import db from '../mongo-connection.js'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

const { JWT_SECRET } = process.env

export default async function deleteFav ({ token, favId }) {
  const usersCollection = db.collection('users')

  const { sub: userId } = jwt.verify(token, JWT_SECRET)

  const result = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $pull: { favs: favId } },
    { returnDocument: 'after' }
  )

  return result.value.favs
}
