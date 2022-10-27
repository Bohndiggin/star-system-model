const express = require('express')
const cors = require('cors')
require('dotenv').config()

const Sequelize = require('sequelize')

const app = express()

app.use(cors())
app.use(express.json())

const { calcStarColor, calcEdits, planetAdd } = require('./controller')

app.post('/api/starColor', calcStarColor)
app.post('/api/edit', calcEdits)
app.post('api/planetAdd', planetAdd)

const PORT = process.env.SERVER_PORT

app.listen(PORT, () => console.log(`Listening on ${PORT}`))