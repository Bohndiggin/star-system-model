const express = require('express')
// const cors = require('cors')
require('dotenv').config()

const Sequelize = require('sequelize')

const app = express()

// app.use(cors())
app.use(express.json())

const { homeGet, seedFunc, homeJSGet, utilsGet, homeRSCSSGet, homeCSSGet,  calcStarColor, calcEdits, planetAdd, starNumGet, starAdd, starAndPlanets } = require('./controller')


app.get('/', homeGet)
// app.get('/seed', seedFunc)
app.get('/js', homeJSGet)
app.get('/utils', utilsGet)
app.get('/rscss', homeRSCSSGet)
app.get('/css', homeCSSGet)
app.post('/api/starColor', calcStarColor)
app.post('/api/edit', calcEdits)
app.post('/api/planetAdd', planetAdd)
app.get('/api/starNumGet', starNumGet)
app.post('/api/starAdd', starAdd)
app.post('/api/star-system', starAndPlanets)

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Listening on ${PORT}`))