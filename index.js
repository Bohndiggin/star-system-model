const G = 6.67384 * Math.pow(10, -11)
const GUnits = "m^3kg^-1s^-2"
const speedOfLight = 299792458
const oneAU = 149597870700
const sbConstant = 5.670374419 * Math.pow(10, -8)

const solarMass = 1.98847 * Math.pow(10, 30)
const solarRadius = 695700
const solarLuminosity = 3.828 * Math.pow(10, 26)
const solarTemp = 5772
const mercuryMass = 3.3011 * Math.pow(10, 23)
const earthMass = 5.9722 * Math.pow(10, 24)
const earthSemiMajorAxis = 149597887 
const lunarMass = 7.342 * Math.pow(10, 22)
const lunarSemiMajorAxis = 384399
const jupiterMass = 1.899 * Math.pow(10, 27)
const jupiterSemiMajorAxis = 5.2038 * oneAU

//max temp, min temp, class name, max mass, min mass, max radius, min radius, max solarlumens, low solarlumens, % of stars
const starClassArr = [
    [1000000, 30000, "O", 20, 16, 8, 6.6, 50000, 30000, 0.03],
    [30000, 10000, "B", 16, 2.1, 6.6, 1.8, 30000, 25, 0.22],
    [10000, 7500, "A", 2.1, 1.4, 1.8, 1.4, 25, 5, 0.6],
    [7500, 6000, "F", 1.4, 1.04, 1.4, 1.15, 5, 1.5, 3],
    [6000, 5200, "G", 1.04, 0.8, 1.15, 0.96, 1.5, 0.6, 7.6],
    [5200, 3700, "K", 0.8, 0.45, 0.96, 0.7, 0.6, 0.08, 12.1],
    [3700, 2400, "M", 0.45, 0.08, 0.07, 0.00001, 0.08, 0.00001, 76.45]
]

function ranDumb(min, max) {
    return (Math.random() * (max - min)) + min
}

function makeSGP (mass1, mass2) { //sgp = standard gravitational parameter
    let sgp = G * (mass1 + mass2)
    return sgp
}

function AUConvert (distance) { //Meters to AU (astronomical units)
    let ans = distance * Math.pow(1.496, -11)
    return ans
}

function calcOrbitalSpeed (mass1, mass2, semiMajorAxis) { //distance must be in km/s
    let ans = Math.sqrt(makeSGP(mass1, mass2)/semiMajorAxis)
    return ans * 1000 //km/year
}

function calcOrbitalSpeedKmps (mass1, mass2, semiMajorAxis) { // in case you want a normal number not a /year number
    let ans = calcOrbitalSpeed(mass1, mass2, semiMajorAxis)
    ans = ans/(3.154 * Math.pow(10, 7))
    return ans
}

console.log(calcOrbitalSpeedKmps(earthMass, solarMass, earthSemiMajorAxis))

function calcOrbitalPeriod (mass1, mass2, semiMajorAxis) {
    let orbitalSpeed = calcOrbitalSpeed(mass1, mass2, semiMajorAxis)
    let orbitLength = 2 * Math.PI * semiMajorAxis
    let ans = orbitLength / orbitalSpeed
    return (ans) * 366 //days to complete a revolution
}

function calcGravitationalForce (mass1, mass2, distance) { //Not sure if this is needed, but this may come in handy. It calculates the Force between 2 objects.
    let ans = G * ((mass1 + mass2)/Math.pow(distance, 2))
    return ans
}

function update () {
    //runs everything. Moves planets. Oh wait. I only need to find the speed once. Then the updater only needs to be fed speeds once
}

function calcStarLuminosity(starTemp, starRadius) { //values must be relative to the sun.
    let area = 4 * Math.PI * Math.pow(starRadius, 2)
    let ans = sbConstant * area * Math.pow(starTemp, 4)
    //console.log(area + "lookee")
    return ans
}

function calcHabitableZone (luminosity) {
    let min = Math.sqrt((luminosity)/1.1)
    let max = Math.sqrt((luminosity)/0.53)
    let minmax = [min, max]
    return minmax
}

// console.log(calcOrbitalSpeed(earthMass, lunarMass, lunarSemiMajorAxis)) // this appears to be speed per year in km

// console.log(calcOrbitalPeriod(earthMass, solarMass, earthSemiMajorAxis) + " Day Orbit") // days to revolve around the sun
// console.log(calcOrbitalPeriod(earthMass, lunarMass, lunarSemiMajorAxis)) // days to revolve around the earth
// console.log(calcGravitationalForce(earthMass, lunarMass, lunarSemiMajorAxis)) //N of force that the Earth-Lunar system has

function classifyStar (starTemp) { //I got lazy so I made a logic loop.
    for (let i=0; i < starClassArr.length; i++) {
        if (starTemp >= starClassArr[i][1] && starTemp < starClassArr[i][0]) {
            console.log(`It's a ${starClassArr[i][2]}-Class Star!`)
            return `It's a ${starClassArr[i][2]}-Class Star!`
        } // once it's classified calculate the luminosity
    }
}

function createRandomStars(starNum) {
    let results = []
    for (let i = 0;i < starNum;i++) {
       let currentClass = ranDumb(0, 10000)/100
       for(let j = 0;j < starClassArr.length;j++) {
        if (currentClass <= starClassArr[j][9]) {
            let temperature = ranDumb(starClassArr[j][1], starClassArr[j][0])
            let starMass = ranDumb(starClassArr[j][4], starClassArr[j][3])
            let starRadius = ranDumb(starClassArr[j][6], starClassArr[j][5])
            let starLuminosity = ranDumb(starClassArr[j][8], starClassArr[j][7])
            let starClass = classifyStar(temperature)
            let starHabitableZone = calcHabitableZone(starLuminosity)
            results.push([temperature, starClass, starMass, starRadius, starLuminosity, starHabitableZone])
        }
       }
    }
    console.log(results)
    //console.log(results[0][5])
}

function createRandomPlanets(planetNum) {
    let results = []
    for(let i = 0;i < planetNum;i++) {
        let currentMass = ranDumb(0, 100)
    }
}

//testing math here.




classifyStar(solarTemp, solarRadius)

// console.log(calcStarLuminosity(solarTemp, 1))
// console.log(calcHabitableZone(solarLuminosity))

//let lum = calcStarLuminosity(solarTemp, 1)
//console.log(lum)

//console.log(calcHabitableZone(lum))

createRandomStars(1)