import express from 'express'
import { registerUser, loginUser } from './logic/index.js'
import jwt from 'jsonwebtoken'

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env

const router = express.Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body

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

})

router.post('/favs/:id', async (req, res) => {

})

router.delete('/favs/:id', async (req, res) => {

})

export default router
