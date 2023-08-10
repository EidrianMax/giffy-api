import express from 'express'
import './load-enviroment.js'
import router from './route.js'
import cors from 'cors'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors())

app.use('/', router)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
