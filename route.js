import express from 'express'
import { registerUser } from './logic/index.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body

  const user = await registerUser({ username, password })

  res.status(201).json(user)
})

router.post('/login', async (req, res) => {

})

router.get('/favs', async (req, res) => {

})

router.post('/favs/:id', async (req, res) => {

})

router.delete('/favs/:id', async (req, res) => {

})

export default router
