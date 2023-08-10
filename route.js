import express from 'express'
import { registerUser, loginUser, getAllFavs, addFav, deleteFav } from './logic/index.js'
import jwt from 'jsonwebtoken'
import userExtractor from './logic/helpers/userIdExtractor.js'

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env

const router = express.Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body

  if (!(username && password)) return res.status(400).json({ message: 'username and password is required' })

  try {
    const user = await registerUser({ username, password })

    res.status(201).json(user)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const userId = await loginUser({ username, password })

    const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.json({ token })
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' })
    console.log(error)
  }
})

router.get('/favs', async (req, res) => {
  const authorization = req.headers.authorization

  try {
    const userId = userExtractor(authorization)
    const favs = await getAllFavs({ userId })

    res.json(favs)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

router.post('/favs/:favId', async (req, res) => {
  const favId = req.params.favId
  const authorization = req.headers.authorization

  try {
    const userId = userExtractor(authorization)
    const favs = await addFav({ userId, favId })

    res.json(favs)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

router.delete('/favs/:favId', async (req, res) => {
  const authorization = req.headers.authorization
  const favId = req.params.favId

  try {
    const userId = userExtractor(authorization)
    const favs = await deleteFav({ userId, favId })

    res.json(favs)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

export default router
