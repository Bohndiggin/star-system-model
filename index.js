const G = 6.67384 * Math.pow(10, -11)
const GUnits = "m^3kg^-1s^-2"
const speedOfLight = 299792458
const AU = 149597870
const sbConstant = 5.670374419 * Math.pow(10, -8)

const solarMass = 1.98847 * Math.pow(10, 30)
const solarRadius = 695700
const solarLuminosity = 3.828 * Math.pow(10, 26)
const solarTemp = 5772
const mercuryMass = 3.3011 * Math.pow(10, 23)
const mercuryTemp = 340.15
const earthMass = 5.9722 * Math.pow(10, 24)
const earthRadius = 6.3781 * Math.pow(10, 6)
const earthSemiMajorAxis = 149597887
const earthTemp = 288
const lunarMass = 7.342 * Math.pow(10, 22)
const lunarSemiMajorAxis = 384399
const lunarTemp = 250
const jupiterMass = 1.899 * Math.pow(10, 27)
const jupiterSemiMajorAxis = 5.2038 * AU
const jupiterTemp = 165
const marsMass = 6.4171 * Math.pow(10, 23)
const marsSemiMajorAxis = 1.524 * AU
const marsRadius = 3396.2
const marsTemp = 213.15

//max temp, min temp, class name, max mass, min mass, max radius, min radius, max solarlumens, low solarlumens, % of stars
const starTypeArr = [ //Make into a Map/dictionary
    [1000000, 30000, "O", 20, 16, 8, 6.6, 50000, 30000, 0.03],
    [30000, 10000, "B", 16, 2.1, 6.6, 1.8, 30000, 25, 0.22],
    [10000, 7500, "A", 2.1, 1.4, 1.8, 1.4, 25, 5, 0.6],
    [7500, 6000, "F", 1.4, 1.04, 1.4, 1.15, 5, 1.5, 3],
    [6000, 5200, "G", 1.04, 0.8, 1.15, 0.96, 1.5, 0.6, 7.6],
    [5200, 3700, "K", 0.8, 0.45, 0.96, 0.7, 0.6, 0.08, 12.1],
    [3700, 2400, "M", 0.45, 0.08, 0.07, 0.00001, 0.08, 0.00001, 100]
]

//Class name, max mass, min mass, max radius, min radius, % of occurance
const planetClassArr = [
    ["smol"]
]

class Star {
    constructor ([temperature, starClass, starMass, starRadius, starLuminosity, starHabitableZone]) {
        this.temperature = temperature
        this.starClass = starClass
        this.starMass = starMass
        this.starRadius = starRadius
        this.starLuminosity = starLuminosity
        this.starHabitableZone = starHabitableZone
    }
}

class Planet {
    constructor ([type, semiMajorAxis, temperature, radius, moons, rings, atmosphere, rotationPeriod, orbitalPeriod, mass]) {
        this.type = type
        this.semiMajorAxis = semiMajorAxis
        this.temperature = temperature
        this.radius = radius
        this.moons = moons
        this.rings = rings
        this.atmosphere = atmosphere
        this.rotationPeriod = rotationPeriod
        this.orbitalPeriod = orbitalPeriod
        this.mass = mass
    }
}

function ranDumb(min, max) {
    return (Math.random() * (max - min)) + min
}

function makeSGP(mass1, mass2) { //sgp = standard gravitational parameter
    let sgp = G * (mass1 + mass2)
    return sgp
}

function AUConvert(distance) { //Meters to AU (astronomical units)
    let ans = distance * Math.pow(1.496, -11)
    return ans
}

function calcOrbitalSpeed(mass1, mass2, semiMajorAxis) { //distance must be in km/s
    let ans = Math.sqrt(makeSGP(mass1, mass2)/semiMajorAxis)
    return ans * 1000 //km/year
}

function calcOrbitalSpeedKmps(mass1, mass2, semiMajorAxis) { // in case you want a normal number not a /year number
    let ans = calcOrbitalSpeed(mass1, mass2, semiMajorAxis)
    ans = ans/(3.154 * Math.pow(10, 7)) //What on space is this?? ANS it's how many seconds there are in a year.
    return ans
}

function calcOrbitalPeriod(mass1, mass2, semiMajorAxis) { //check against other planets.
    let orbitalSpeed = calcOrbitalSpeed(mass1, mass2, semiMajorAxis)
    let orbitLength = 2 * Math.PI * semiMajorAxis
    let ans = orbitLength / orbitalSpeed
    return (ans) * 366 //days to complete a revolution
}

function calcGravitationalForce(mass1, mass2, distance) { //Not sure if this is needed, but this may come in handy. It calculates the Force between 2 objects.
    let ans = G * ((mass1 + mass2)/Math.pow(distance, 2))
    return ans
}

function update() {
    //runs everything. Moves planets. Oh wait. I only need to find the speed once. Then the updater only needs to be fed speeds once
}

function calcStarLuminosity(starTemp, starRadius) { //values must be relative to the sun.
    let area = 4 * Math.PI * Math.pow(starRadius, 2)
    let ans = sbConstant * area * Math.pow(starTemp, 4)
    return ans
}

function calcHabitableZone(luminosity) {
    let min = Math.sqrt((luminosity)/1.1)
    let max = Math.sqrt((luminosity)/0.53)
    let minmax = [min, max]
    return minmax
}


function classifyStar(starTemp) { //I got lazy so I made a logic loop.
    for (let i=0; i < starTypeArr.length; i++) {
        if (starTemp >= starTypeArr[i][1] && starTemp < starTypeArr[i][0]) {
            return `It's a ${starTypeArr[i][2]}-Class Star!`
        }
    }
}

function calcBodyTempSolar(starTemp, starRadius, semiMajorAxis) {
    return starTemp*Math.sqrt(starRadius/(2 * semiMajorAxis)) * Math.pow(.7, 1/4)
}

function calcBodyType(temperature, currentSize) { //conditional logic to determine what kind of planed it is.
    return "chunky"
}

function calcAtmosphere(temperature, semiMajorAxis) {//temp and semiMajorAxis influence a chance to get an atmosphere.
    return false
}

function calcBodyTempAtmosphere(temperature, atmosphere) {
        if(atmosphere) {
        return "gassy"
    } else {
        return temperature
    }
}

function calcBodyMass(currentSize, currentType) {
    return "heavy"
}

function createRandomStars(starNum) { //only works for one star now
    let results = []
    for (let i = 0;i < starNum;i++) {
       let currentClass = ranDumb(1, 10000)/100
       for(let j = 0;j < starTypeArr.length;j++) {
        if (currentClass <= starTypeArr[j][9]) { //using Math.random I generate the stats of the stars. This is because the relationship between temperature and Luminosity is too complex lol.
            let temperature = ranDumb(starTypeArr[j][1], starTypeArr[j][0])
            let starMass = ranDumb(starTypeArr[j][4], starTypeArr[j][3])
            let starRadius = ranDumb(starTypeArr[j][6], starTypeArr[j][5])
            let starLuminosity = ranDumb(starTypeArr[j][8], starTypeArr[j][7])
            let starClass = classifyStar(temperature)
            let starHabitableZone = calcHabitableZone(starLuminosity)
            //results.push([temperature, starClass, starMass, starRadius, starLuminosity, starHabitableZone])
            results = [temperature, starClass, starMass, starRadius, starLuminosity, starHabitableZone] //NOW how to create n objects??
        }
       }
    }
    return results
}

function createRandomPlanets(planetNum, starObj) {//don't forget to input the star as an object
    let results = []
    let minDistance = .01 * AU
    let maxDistance = 5 * AU
    for(let i = 0;i < planetNum;i++) {
        let currentSemiMajorAxis = ranDumb(minDistance, maxDistance) // needs star input.
        let currentSize = ranDumb(0.1, 999999) // PLACEHOLDER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let currentTemperature = calcBodyTempSolar(starObj.temperature, (starObj.starRadius * solarRadius), currentSemiMajorAxis)
        let currentType = calcBodyType(currentTemperature, currentSemiMajorAxis)
        let currentAtmosphere = calcAtmosphere(currentTemperature, currentSemiMajorAxis)
        let currentMass = calcBodyMass(currentSize, currentType)
        let rotationPeriod = "wizard MATH"
        let orbitalPeriod = calcOrbitalPeriod(currentMass, starObj.starMass, currentSemiMajorAxis)
        let currentMoons = 0
        let currentRings = 0
        results = [currentType, currentSemiMajorAxis, currentTemperature, currentSize, currentMoons, currentRings, currentAtmosphere, rotationPeriod, orbitalPeriod, currentMass]
    }
    return results
}

//testing math here.
const star1 = new Star(createRandomStars(1))
const planet1 = new Planet(createRandomPlanets(1, star1))
console.log(star1)
console.log(planet1)

console.log(calcBodyTempSolar(solarTemp, solarRadius, marsSemiMajorAxis))

console.log(solarTemp*Math.sqrt(solarRadius/(2 * AU)) * Math.pow(.7, 1/4)) /////////////////OH MY THIS IS IT!!!!!!!!!!!!!
console.log(calcBodyTempSolar(solarTemp, solarRadius, earthSemiMajorAxis))