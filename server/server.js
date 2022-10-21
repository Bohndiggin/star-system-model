const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const { calcStarColor } = require('./controller')

app.get('/api/starColor', calcStarColor)

const PORT = 5000

app.listen(PORT, () => console.log(`Listening on ${PORT}`))