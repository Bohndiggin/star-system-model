const express = require('express')
require('dotenv').config()

const app = express()

app.use(express.json())

const { homeGet, seedFunc, homeJSGet, utilsGet, homeRSCSSGet, homeCSSGet,  calcStarColor, calcEdits, planetAdd, starNumGet, starAdd, starAndPlanets } = require('./controller')


app.get('/', homeGet)
app.get('/superUltraSecretURLEndpoint', seedFunc)
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