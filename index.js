const G = 6.67384 * Math.pow(10, -11)
const GUnits = "m^3kg^-1s^-2"
const speedOfLight = 299792458
const oneAU = 149597870700

const solarMass = 1.98847 * Math.pow(10, 30)
const mercuryMass = 3.3011 * Math.pow(10, 23)
const earthMass = 5.9722 * Math.pow(10, 24)
const earthSemiMajorAxis = 149597887 
const lunarMass = 7.342 * Math.pow(10, 22)
const lunarSemiMajorAxis = 384399

const starClassArr = [
    [1000000, 30000, "O"],
    [30000, 10000, "B"],
    [10000, 7500, "A"],
    [7500, 6000, "F"],
    [6000, 5200, "G"],
    [5200, 3700, "K"],
    [3700, 2400, "M"]
]

function makeSGP (mass1, mass2) { //sgp = standard gravitational parameter
    let sgp = G * (mass1 + mass2)
    return sgp
}

function AUConvert (distance) { //Meters to AU (astronomical units)
    let ans = distance * Math.pow(1.496, -11)
    return ans
}

function getOrbitalSpeed (mass1, mass2, semiMajorAxis) { //distance must be in km/s
    let ans = Math.sqrt(makeSGP(mass1, mass2)/semiMajorAxis)
    return ans * 1000 //km/year
}

function getOrbitalSpeedKmps (mass1, mass2, semiMajorAxis) { // in case you want a normal number not a /year number
    let ans = getOrbitalSpeed(mass1, mass2, semiMajorAxis)
    ans = ans/(3.154 * Math.pow(10, 7))
    return ans
}

console.log(getOrbitalSpeedKmps(earthMass, solarMass, earthSemiMajorAxis))

function getOrbitalPeriod (mass1, mass2, semiMajorAxis) {
    let orbitalSpeed = getOrbitalSpeed(mass1, mass2, semiMajorAxis)
    let orbitLength = 2 * Math.PI * semiMajorAxis
    let ans = orbitLength / orbitalSpeed
    return (ans) * 366 //days to complete a revolution
}

function getGravitationalForce (mass1, mass2, distance) { //Not sure if this is needed, but this may come in handy. It calculates the Force between 2 objects.
    let ans = G * ((mass1 + mass2)/Math.pow(distance, 2))
    return ans
}

function update () {
    //runs everything. Moves planets. Oh wait. I only need to find the speed once. Then the updater only needs to be fed speeds once
}

console.log(getOrbitalSpeed(earthMass, lunarMass, lunarSemiMajorAxis)) // this appears to be speed per year in km

console.log(getOrbitalPeriod(earthMass, solarMass, earthSemiMajorAxis) + " Day Orbit") // days to revolve around the sun
console.log(getOrbitalPeriod(earthMass, lunarMass, lunarSemiMajorAxis)) // days to revolve around the earth
console.log(getGravitationalForce(earthMass, lunarMass, lunarSemiMajorAxis)) //N of force that the Earth-Lunar system has

function classifyStar (starTemp) { //I got lazy so I made a logic loop.
    for (let i=0; i < starClassArr.length; i++) {
        if (starTemp >= starClassArr[i][1] && starTemp < starClassArr[i][0]) {
            console.log(`It's a ${starClassArr[i][2]}-Class Star!`)
        }
    }
}

classifyStar(7500)