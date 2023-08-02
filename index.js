import express from 'express'
import './load-enviroment.js'
import router from './route.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use('/', router)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
