import db from '../mongo-connection.js'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

const { JWT_SECRET } = process.env

export default async function getAllFavs ({ token }) {
  const usersCollection = db.collection('users')

  const { sub: userId } = jwt.verify(token, JWT_SECRET)

  const user = await usersCollection.findOne({ _id: new ObjectId(userId) })

  return user.favs
}
