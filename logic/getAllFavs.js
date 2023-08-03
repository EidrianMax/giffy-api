import db from '../mongo-connection.js'
import jwt from 'jsonwebtoken'

const { JWT_SECRET } = process.env

export default async function getAllFavs ({ token }) {
  const usersCollection = db.collection('users')

  const { sub: userId } = jwt.verify(token, JWT_SECRET)

  const user = usersCollection.findOne({ _id: userId })

  return user.favs || []
}
