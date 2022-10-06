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
const bodyTypeArr = [
]

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

function calcStarLuminosity(starTemp) { //values must be relative to the sun.
    let ans = starTemp/solarTemp
    return ans
}

function calcHabitableZone(starTemp, starRadius) { //calculate to be between 175K and 300K
    let max = 0
    console.log((Math.pow(starTemp/(254.58 * Math.pow(0.7, 1/4)), 2) * (starRadius/2))/AU) // NEEDS TO EQUAL 1 AU
    let min = 0
    let minmax = [min, max]
    return minmax
}

// console.log(calcHabitableZone(solarTemp, solarRadius))


function classifyStar(starTemp) { //I got lazy so I made a logic loop.
    for (let i=0; i < starTypeArr.length; i++) {
        if (starTemp >= starTypeArr[i][1] && starTemp < starTypeArr[i][0]) {
            return `It's a ${starTypeArr[i][2]}-Class Star!`
        }
    }
}

function calcBodyTempSolar(starTemp, starRadius, bodySemiMajorAxis) { //MAGIC math. Determines approx. body temp based on the body's distance from it's star.
    return starTemp*Math.sqrt(starRadius/(2 * bodySemiMajorAxis)) * Math.pow(.7, 1/4)
}
// console.log(calcBodyTempSolar(solarTemp, solarRadius, earthSemiMajorAxis))
// console.log(calcBodyTempSolar(solarTemp, solarRadius, AU))


function clacBodyComposition() {
    let ans = {}
    let iceContent = ranDumb(1, 100)
    let rockContent = ranDumb(1, 100)
    let metalContent = ranDumb(1, 100)
    ans.ice = (iceContent / (iceContent + rockContent + metalContent)) * 100
    ans.rock = (rockContent / (iceContent + rockContent + metalContent)) * 100
    ans.metal = (metalContent / (iceContent + rockContent + metalContent)) * 100
    return ans
}

console.log(clacBodyComposition())


function calcBodyTypeFirstPass(temperature, size, composition) { //conditional logic to determine what kind of planet it is.
    let type = ""
    for(let i = 0;i<bodyTypeArr.length;i++) {
        if(temperature >= bodyTypeArr[i][0]) {
            type = "junk"
        }
    }
    return "chunky"
}

function calcBodyTypeSecondPass(temperature) {
    return "somethin"
}

function calcBodyAtmosphere(temperature, type, semiMajorAxis) {//temp and semiMajorAxis influence a chance to get an atmosphere.
    return false
}

function calcBodyTempAtmosphere(temperature, atmosphere) {
    if(atmosphere) {
        return "gassy"
    } else {
        return temperature
    }
}

function calcIceBlast(temperature) {
    return "kaboom"
}

function calcBodyMass(size, type) {
    return "heavy"
}

function calcBodyGravity(mass, size) {
    return 9.8
}

class Star {
    constructor () {
        let currentClass = ranDumb(1, 10000)/100
        for(let j = 0;j < starTypeArr.length;j++) {
            if (currentClass <= starTypeArr[j][9]) { //using Math.random I generate the stats of the stars. This is because the relationship between temperature and Luminosity is too complex lol.
                this.temperature = ranDumb(starTypeArr[j][1], starTypeArr[j][0])
                this.starMass = ranDumb(starTypeArr[j][4], starTypeArr[j][3])
                this.starRadius = ranDumb(starTypeArr[j][6], starTypeArr[j][5]) // get radius correct.
            }
        }
    this.starLuminosity = calcStarLuminosity(this.temperature)
    this.starClass = classifyStar(this.temperature)
    this.starHabitableZone = calcHabitableZone(this.temperature, this.starRadius * solarRadius)
    }
}

class Planet {
    constructor (starObj) {
        let minDistance = (.01 * AU) * (starObj.temperature/solarTemp)
        let maxDistance = (15 * AU) * (starObj.temperature/solarTemp)
        this.bodySemiMajorAxis = ranDumb(minDistance, maxDistance)
        this.bodySize = ranDumb(0.1, 99999) // PLACEHOLDER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.bodyTemperature = calcBodyTempSolar(starObj.temperature, (starObj.starRadius * solarRadius), this.bodySemiMajorAxis)
        this.bodyComposition = clacBodyComposition()
        this.bodyType = calcBodyTypeFirstPass(this.bodyTemperature, this.bodySize, this.bodyComposition)
        this.bodyAtmosphere = calcBodyAtmosphere(this.bodyTemperature, this.bodyType, this.bodySemiMajorAxis)
        this.bodyTemperature = calcBodyTempAtmosphere(this.bodyTemperature, this.bodyAtmosphere)
        this.bodyType = calcBodyTypeSecondPass()
        this.bodyComposition = calcIceBlast(this.bodyTemperature)
        this.bodyMass = calcBodyMass(this.bodySize, this.bodyComposition)
        this.bodyRotationPeriod = "wizard MATH"
        this.bodyOrbitalPeriod = calcOrbitalPeriod(this.bodyMass, (starObj.starMass * solarMass), this.bodySemiMajorAxis)
        this.bodyMoons = 0
        this.bodyRings = 0
        this.bodyGravity = calcBodyGravity(this.bodyMass, this.bodySize)
    }
    orbit() {
        //display updating
    }
}

function createNBodies(bodyNum, starObj) {
    let bodies = []
    for(let i = 0;i<bodyNum;i++) {
        bodies.push(new Planet(starObj))
    }
    return bodies
}


//testing math here.

// let star = new Star()
// console.log(star)
// let planet = new Planet(star)
// // console.log(planet)
// let planets = createNBodies(10, star)
// console.log(createNBodies(20, star))
// console.log(planets)
// let planets = createRandomPlanets(1, star)

// console.log(star)
// console.log(star[0].starHabitableZone[0]/AU)
// console.log(planets[0].semiMajorAxis/AU)
// console.log(planets[0].temperature)