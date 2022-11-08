const Sequelize = require('sequelize')
const path = require('path');
require('dotenv')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

const {ranDumb, getRandomColor, makeSGP, AUConvert, calcOrbitalSpeed, calcOrbitalSpeedKmps, calcOrbitalPeriod, calcGravitationalForce, calcStarRadius, calcStarLuminosity, calcHabitableZone, classifyStar, calcBodyTempSolar, clacBodyComposition, calcBodyTypeFirstPass, calcBodyTypeSecondPass, calcBodyAtmosphere, calcBodyTempAtmosphere, calcIceBlast, calcBodyMass, calcBodyGravity} = '/utils';

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
        const { curr, changes } = req.body
        const { stagedSMA, stagedSMAAU, stagedName, stagedRadius, stagedEcc, stagedTemp, stagedType } = curr
        const { ecc, smaAU } = changes
        // if nothing has changed, do nothing
        // if there is a change send the new values.
        let current = [stagedEcc, stagedSMAAU]
        let changed = [ecc, smaAU]
        let fullChanges = {
            resEcc: 0,
            resSMAAU: 0
        }
        if (current === changed) {
            res.sendStatus(400)
        } else {
        //for each curr stat if changed !== stat then fullChanges.resStat = changed version else fullChanges.resStat = original stat.
            for (let i = 0; i < changed.length; i++) {
                if (current[i] === changed[i] || changed[i] === null) {
                    fullChanges[Object.keys(fullChanges)[i]] = current[i]
                } else {
                    fullChanges[Object.keys(fullChanges)[i]] = changed[i]
                }
            }
            res.status(200).send(fullChanges)
        }
    },
    seedFunc: (req, res) => {
        sequelize.query(`
        DROP TABLE IF EXISTS stars_to_planets;
        DROP TABLE IF EXISTS planets;
        DROP TABLE IF EXISTS stars;
        CREATE TABLE planets(
            id SERIAL PRIMARY key,
            sma FLOAT,
            smaAU FLOAT,
            name varchar(25),
            body_radius FLOAT,
            body_ecc FLOAT,
            body_temp FLOAT,
            body_type VARCHAR(50)
          );
          
          CREATE TABLE stars(
            id SERIAL PRIMARY key,
            star_temp FLOAT,
            star_radius_solar FLOAT,
            star_mass_solar FLOAT,
            star_lum FLOAT
          );
          
          
          CREATE TABLE stars_to_planets (
            id SERIAL PRIMARY key,
            star_id INT,
            planet_id INT,
            FOREIGN KEY (star_id) REFERENCES stars(id),
            FOREIGN KEY (planet_id) REFERENCES planets(id)
          
          );
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => {
            console.log(err)
        })
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
    }    
}