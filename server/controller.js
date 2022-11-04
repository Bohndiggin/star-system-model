const Sequelize = require('sequelize')
const path = require('path');
require('dotenv')
const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
  })

function rgbToHex (r, g, b) {
    let rHex, gHex, bHex
    
    rHex = Math.floor(r).toString(16)
    gHex = Math.floor(g).toString(16)
    bHex = Math.floor(b).toString(16)
    return rHex+gHex+bHex
}

module.exports = {
    calcStarColor: (req, res) => {
        let temp100 = req.body.tempColor
        console.log(req.body)
        console.log(temp100)
        let red = 0
        let green = 0
        let blue = 0
        temperature = temp100 / 100
        console.log(temperature)
        if(temperature <= 66) {
            red = 255
        } else {
            red = temperature - 60
            red = 329.698727446 * (red ** -0.1332047592)
            if(red < 0) {
                red = 0
            } else if (red > 255) {
                red = 255
            }
        }
        if(temperature <= 66) {
            green = temperature
            green = 99.4708025861 * Math.log(green) - 161.1195681661
            if(green < 0) {
                green = 0
            } else if (green > 255) {
                green = 255
            }
        } else {
            green = temperature - 60
            green = 288.1221695283 * (green ** -0.0755148492)
            if(green < 0) {
                green = 0
            } else if (green > 255) {
                green = 255
            }
        }
        if (temperature >= 66) {
            blue = 255
        } else {
            if (temperature <= 19) {
                blue = 0
            } else {
                blue = temperature -10
                blue = 138.5177312231 * Math.log(blue) - 305.0447927307
                if(blue < 0) {
                    blue = 0
                } else if (blue > 255) {
                    blue = 255
                }
            }
        }
        let colorRGB = `rgb(${red}, ${green}, ${blue})`
        let colorHex = rgbToHex(red, green, blue)
        let colorNum = `0x` + colorHex
        console.log(colorNum)
        console.log(colorNum)
        let response = {
            starColor: colorRGB,
            starColorHex: "#" + colorHex,
            starColorNum: colorNum
        }
        res.status(200).send(response)
    },
    calcEdits: (req, res) => {
        let edited = req.body.editable
        let original = [req.body.bodySemiMajorAxisAU, req.body.eccentricity]
    },
    planetAdd: (req, res) => { //write a query that finds out how many stars are in the db and assigns the planets to the right star.
        // console.log(req.body)
        let {stagedSMA, stagedSMAAU, stagedName, stagedRadius, stagedEcc, stagedTemp, stagedType} = req.body
        sequelize.query(`
        INSERT INTO planets(sma, smaAU, name, body_radius, body_ecc, body_temp, body_type)
        VALUES (${stagedSMA}, ${stagedSMAAU}, '${stagedName}', ${stagedRadius}, ${stagedEcc}, ${stagedTemp}, '${stagedType}');
        SELECT count(id) FROM planets;
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => {
            res.status(500).send(err)
        })
    },
    starNumGet: (req, res) => {
        sequelize.query(`
            SELECT count(id) FROM stars
        `)
        .then(dbRes => {
            console.log(dbRes[0])
            res.status(200).send(dbRes[0])
        })
        .catch(err => {
            res.status(500).send(err)
        })
    },
    starAdd: (req, res) => {
        let {sendStarTemp, sendStarRadius, sendStarMass, sendStarLum} = req.body
        sequelize.query(`
            INSERT INTO stars(star_temp, star_radius_solar, star_mass_solar,  star_lum)
            VALUES(${sendStarTemp}, ${sendStarRadius}, ${sendStarMass}, ${sendStarLum});
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => {
            res.status(500).send(err)
        })
    },
    starAndPlanets: (req, res) => {
        let {s, p} = req.body
        sequelize.query(`
            INSERT INTO stars_to_planets(star_id, planet_id)
            VALUES (${s}, ${p})
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => {
            res.status(500).send(err)
        })
    },
    homeGet: (req, res) => {
        res.sendFile(path.join(__dirname, '../client/index.html'))
    },
    homeJSGet: (req, res) => {
        res.sendFile(path.join(__dirname, '../client/main.js'))
    },
    homeCSSGet: (req, res) => {
        res.sendFile(path.join(__dirname, '../client/style.css'))
    },
    homeRSCSSGet: (req, res) => {
        res.sendFile(path.join(__dirname, '../client/reset.css'))
    },
    utilsGet: (req, res) => {
        res.sendFile(path.join(__dirname, '../client/utils.js'))
    },
    pixiGet: (req, res) => {
        res.sendFile(path.join(__dirname, '../node_modules/'))
    }
}