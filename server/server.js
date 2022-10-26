const express = require('express')
const cors = require('cors')

const Sequelize = require('sequelize')

const app = express()

app.use(cors())
app.use(express.json())

const { calcStarColor, calcEdits, planetAdd } = require('./controller')

app.post('/api/starColor', calcStarColor)
app.post('/api/edit', calcEdits)
app.post('api/planetAdd', planetAdd)

const PORT = 5000

app.listen(PORT, () => console.log(`Listening on ${PORT}`))