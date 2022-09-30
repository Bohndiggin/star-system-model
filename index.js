const G = 6.67384 * Math.pow(10, -11)
const GUnits = "m^3kg^-1s^-2"

const solarMass = 1.98847 * Math.pow(10, 30)
const mercuryMass = 3.3011 * Math.pow(10, 23)
const earthMass = 5.9722 * Math.pow(10, 24)
const earthSemiMajorAxis = 149597887 
const lunarMass = 7.342 * Math.pow(10, 22)
const lunarSemiMajorAxis = 384399

function makeSGP (mass1, mass2) { //sgp = standard gravitational parameter
    let sgp = G * (mass1 + mass2)
    return sgp
}

function AUConvert (distance) {
    let ans = distance * Math.pow(1.496, -11)
    return ans
}

function getOrbitalSpeed (mass1, mass2, semiMajorAxis) { //distance must be in km/s
    let ans = Math.sqrt(makeSGP(mass1, mass2)/semiMajorAxis)
    return ans * 1000 //km/year
}

function getOrbitalSpeedKps (mass1, mass2, semiMajorAxis) { // in case you want a normal number not a /year number
    let ans = getOrbitalSpeed(mass1, mass2, semiMajorAxis)
    ans = ans/(3.154 * Math.pow(10, 7))
    return ans
}

console.log(getOrbitalSpeedKps(earthMass, solarMass, earthSemiMajorAxis))

function getOrbitalPeriod (mass1, mass2, semiMajorAxis) {
    let orbitalSpeed = getOrbitalSpeed(mass1, mass2, semiMajorAxis)
    let orbitLength = 2 * Math.PI * semiMajorAxis
    let ans = orbitLength / orbitalSpeed
    return (ans) * 366 //days to complete a revolution
}

function update () {
    //runs everything. Moves planets. Oh wait. I only need to find the speed once. Then the updater only needs to be fed speeds once
}

console.log(getOrbitalSpeed(earthMass, lunarMass, lunarSemiMajorAxis)) // this appears to be speed per year in km

console.log(getOrbitalPeriod(earthMass, solarMass, earthSemiMajorAxis)) // days to revolve around the sun
console.log(getOrbitalPeriod(earthMass, lunarMass, lunarSemiMajorAxis)) // days to revolve around the earth