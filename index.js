const G = 6.67384 * Math.pow(10, -11)
const GUnits = "m^3kg^-1s^-2"
const speedOfLight = 299792458
const AU = 149597870
const sbConstant = 5.670374419 * Math.pow(10, -8)
const kBoilingPoint = 373.15
const cubicMeterOfRockMass = 2515
const cubicMeterOfIceMass = 919
const cubicMeterOfMetalMass = 8908

const solarMass = 1.98847 * Math.pow(10, 30)
const solarRadius = 695700
const solarLuminosity = 3.828 * Math.pow(10, 26)
const solarTemp = 5772
const mercuryMass = 3.3011 * Math.pow(10, 23)
const mercuryTemp = 340.15
const earthMass = 5.9722 * Math.pow(10, 24)
const earthRadius = 6371// * Math.pow(10, 6)
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

let planetNumber = 0
let jsBodies = []
let displayElement = document.querySelector('display')
let planetBoxEle = document.getElementById('planetBox')
let childrenplanets = planetBoxEle.children
let planetGenButton = document.getElementById('addPlanet')
let listButton = document.getElementById('listPlanets')
let bonkBtn = document.getElementById('bonk')
let cease = false
let playBtn = document.getElementById('play')
let stopBtn = document.getElementById('stop')

//max temp, min temp, class name, max mass, min mass, max radius, min radius, max solarlumens, low solarlumens, % of stars
class StarTypes{
    constructor(minTemp, maxTemp, className, minMass, maxMass, minRadius, maxRadius, minLumens, maxLumens, frequency) {
        this.minTemp = minTemp,
        this.maxTemp = maxTemp,
        this.className = className,
        this.minMass = minMass,
        this.maxMass = maxMass,
        this.minRadius = minRadius,
        this.maxRadius = maxRadius,
        this.minLumens = minLumens,
        this.maxLumens = maxLumens,
        this.frequency = frequency
    }
}
//max temp, min temp, class name, max mass, min mass, max radius, min radius, max solarlumens, low solarlumens, % of stars
const starTypeArr = [
    new StarTypes(30000, 1000000, 'O', 16, 20, 6.6, 8, 30000, 50000, 0.03),
    new StarTypes(10000, 30000, 'B', 2.1, 16, 1.8, 30000, 25, 0.22),
    new StarTypes(7500, 10000, 'A', 1.4, 2.1, 1.4, 1.8, 5, 25, 0.6),
    new StarTypes(6000, 7500, 'F', 1.04, 1.4, 1.15, 1.4, 1.5, 5, 3),
    new StarTypes(5200, 6000, 'G', 0.8, 1.04, 0.96, 1.15, 0.6, 1.5, 7.6),
    new StarTypes(3700, 5200, 'K', 0.45, 0.8, 0.7, 0.96, 0.08, 0.6, 12.1),
    new StarTypes(2400, 3700, 'M', 0.08, 0.45, 0.00001, 0.07, 0.00001, 0.08, 100)
]

//Class name, max mass, min mass, max radius, min radius, % of occurance
class PlanetTypes {
    constructor(minTemperature, maxTemperature, planetTypeName) {
        this.minTemp = minTemperature
        this.maxTemp = maxTemperature
        this.planetType = planetTypeName
    }
}

const temperatureArrayRocky = [
    new PlanetTypes(00, 50, 'cold'),
    new PlanetTypes(50, 100, 'chilly'),
    new PlanetTypes(100, 200, 'brisky'),
    new PlanetTypes(200, 275, 'frozen'),
    new PlanetTypes(275, 300, 'earth-like'),
    new PlanetTypes(300, kBoilingPoint, 'desert-world'),
    new PlanetTypes(kBoilingPoint, 450, 'boiling'),
    new PlanetTypes(450, 600, 'lava-world'),
    new PlanetTypes(600, Infinity, 'hell-world')
]

const temperatureArrayIcy = [
    new PlanetTypes(00, 50, 'cold'),
    new PlanetTypes(50, 100, 'chilly'),
    new PlanetTypes(100, 200, 'brisky'),
    new PlanetTypes(200, 275, 'frozen'),
    new PlanetTypes(275, 300, 'ocean'),
    new PlanetTypes(300, kBoilingPoint, 'Hot Ocean')
]

const temperatureArrayMetalic = [
    new PlanetTypes(00, 50, 'cold'),
    new PlanetTypes(50, 100, 'chilly'),
    new PlanetTypes(100, 200, 'brisky'),
    new PlanetTypes(200, 275, 'frozen'),
    new PlanetTypes(275, 300, 'rust-world'),
    new PlanetTypes(300, kBoilingPoint, 'pot-world'),
    new PlanetTypes(kBoilingPoint, 450, 'boiling'),
    new PlanetTypes(450, 600, 'stovetop'),
    new PlanetTypes(600, 1200, 'oven-world'),
    new PlanetTypes(1200, Infinity, 'tartarus')
]

function ranDumb(min, max) { //makes random numbers in the range specified
    return (Math.random() * (max - min)) + min
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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

function calcOrbitalPeriod(mass1, mass2, semiMajorAxis) { //returns how many earth days it takes to go around the star
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

function calcStarRadius(mass) { //I looked up how much mass effects radius. Here you go.
    return Math.pow(mass, 0.8)
}

function calcStarLuminosity(starTemp) { //values must be relative to the sun. YOU Might be able to calculate this FR
    let ans = starTemp/solarTemp
    return ans
}

// function calcP(mass1, mass2, specificAngularMomentum) { //CANCER MATH. May need later
//     return Math.pow(specificAngularMomentum, 2) / makeSGP(mass1, mass2)
// }

// console.log(calcP(solarMass, earthMass, 29.78))

function calcHabitableZone(starTemp, starRadius) { //calculate to be between 175K and 300K FIXED!!
    let max =  1 / (Math.pow(175 / starTemp / Math.pow(0.7, 1 / 4), 2) * 2 / starRadius)
    let min =  1 / (Math.pow(300 / starTemp / Math.pow(0.7, 1 / 4), 2) * 2 / starRadius)
    let minmax = [min, max]
    return minmax
}

// console.log(calcHabitableZone(solarTemp, solarRadius))


function classifyStar(starTemp) { //I got lazy so I made a logic loop. this will name the star according to its class
    for (let i=0; i < starTypeArr.length; i++) {
        if (starTemp >= starTypeArr[i].minTemp && starTemp < starTypeArr[i].maxTemp) {
            return `It's a ${starTypeArr[i].className}-Class Star!`
        }
    }
}

function calcBodyTempSolar(starTemp, starRadius, bodySemiMajorAxis) { //MAGIC math. Determines approx. body temp based on the body's distance from it's star.
    return starTemp*Math.sqrt(starRadius/(2 * bodySemiMajorAxis)) * Math.pow(.7, 1/4)
}
// console.log(calcBodyTempSolar(solarTemp, solarRadius, earthSemiMajorAxis))
// console.log(calcBodyTempSolar(solarTemp, solarRadius, AU))


function clacBodyComposition() { //randomly choose what the planet is made of.
    let ans = {}
    let iceContent = ranDumb(1, 100)
    let rockContent = ranDumb(1, 100)
    let metalContent = ranDumb(1, 100)
    ans.ice = (iceContent / (iceContent + rockContent + metalContent)) * 100
    ans.rock = (rockContent / (iceContent + rockContent + metalContent)) * 100
    ans.metal = (metalContent / (iceContent + rockContent + metalContent)) * 100
    return ans
}

function calcBodyTypeFirstPass(temperature, size, composition) { //conditional logic to determine what kind of planet it is.
    let type = ""
    if(composition.ice > composition.rock && composition.ice > composition.metal) {
        type += "icy "
    } else if (composition.rock > composition.ice && composition.rock > composition.metal) {
        type += "rocky "
    } else if (composition.metal > composition.ice && composition.metal > composition.rock) {
        type += "metalic "
    } else {
        type += "It's Complicated "
    }
    if(type === "icy ") {
        for(let i = 0;i<temperatureArrayIcy.length;i++) { //using some objects I will add stats to the planet. (mostly for the name of the planet.) WORK IN PROGRESS
            if(temperature > temperatureArrayIcy[i].minTemp && temperature < temperatureArrayIcy[i].maxTemp) {
                type += temperatureArrayIcy[i].planetType
            }
        }
    }
    if(type === "rocky ") {
        for(let i = 0;i<temperatureArrayRocky.length;i++) {
            if(temperature > temperatureArrayRocky[i].minTemp && temperature < temperatureArrayRocky[i].maxTemp) {
                type += temperatureArrayRocky[i].planetType
            }
        }
    }
    if(type === "metalic ") {
        for(let i = 0;i<temperatureArrayMetalic.length;i++) {
            if(temperature >= temperatureArrayMetalic[i].minTemp && temperature < temperatureArrayMetalic[i].maxTemp) {
                type += temperatureArrayMetalic[i].planetType
            }
        }
    }
    return type
}

function calcBodyTypeSecondPass(temperature) { //temp will change when given an atmosphere, this will calculate it.
    return "somethin else"
}

function calcBodyAtmosphere(temperature, type, semiMajorAxis) {//temp and semiMajorAxis influence a chance to get an atmosphere.
    return false
}

function calcBodyTempAtmosphere(temperature, atmosphere) { //in work. Help.
    if(atmosphere) {
        return "gassy"
    } else {
        return temperature
    }
}

function calcIceBlast(obj) { //if the body temperature is above boiling, we'll blast away any water on the planet.
    if(obj.temperature > kBoilingPoint) {
        obj.bodyRadius -= obj.bodyRadius * (obj.composition.ice/100)
        obj.composition.ice = 0
        let rockTemporary = (obj.composition.rock / (obj.composition.rock + obj.composition.metal)) * 100
        let metalTemporary = (obj.composition.metal / (obj.composition.metal + obj.composition.rock)) * 100
        obj.composition.rock = rockTemporary
        obj.composition.metal = metalTemporary
    }
    return obj.bodyComposition
}

function calcBodyMass(size, composition) { // using the mass of ice, rock, and uh nickel to find the stelar body's mass
    let mass = 0
    let volume = (4/3) * Math.PI * Math.pow(size, 3)
    mass += volume * (composition.rock/100) * cubicMeterOfRockMass * 1000**3
    mass += volume * (composition.ice/100) * cubicMeterOfIceMass * 1000**3
    mass += volume * (composition.metal/100) * cubicMeterOfMetalMass * 1000**3
    return mass
}

function calcBodyGravity(mass, size) { //helps find relative gravity to earth
    return (mass/earthMass)/Math.pow((size/earthRadius), 2)
}

// function setOrbit(xOffset, yOffset, planetName, radius, orbitalSpeed) {
//     let timer = null
//     let planet1 = document.getElementById(planetName)
//     clearInterval(timer)
//     let xPosition = 0
//     let yPosition = 0
//     timer = setInterval(frame, 5);
//     function frame() {
//         if(xPosition === 1 || cease) {
//             clearInterval(timer)
//         } else {
//             xPosition += orbitalSpeed / 100
//             yPosition += orbitalSpeed / 100
//             planet1.style.left = Math.cos(xPosition) * radius + xOffset + 'px'
//             planet1.style.top = Math.sin(yPosition) * radius + yOffset + 'px'
//         }
//     }
// }

function allStop() {
    for (let i = 0; i < jsBodies.length; i++) {
        jsBodies[i].cease = true       
    }
}

stopBtn.addEventListener('click', allStop)

function allGo() {
    for(let i = 0;i<jsBodies.length;i++) {
        jsBodies[i].cease = false
        jsBodies[i].orbitRestart()
    }
}

playBtn.addEventListener('click', allGo)

function listPlanets() {
    let htmlPlanets = planetBoxEle.children
    console.log(htmlPlanets)
    console.log()
}

listButton.addEventListener('click', listPlanets)

function clickPresent(obj) {
    let bodyCaught = null
    for (let i = 0; i < jsBodies.length; i++) {
        if (jsBodies[i].bodyName === obj.id) {
            console.log(`found ${jsBodies[i].bodyName}`)
            bodyCaught = jsBodies[i]
            break            
        } 
    }
    bodyCaught.presentInfo()
}

function bonk() {
    let randomPlanet = jsBodies[Math.floor(ranDumb(0, jsBodies.length))]
    randomPlanet.changeOrbitSMA(10000)
}

bonkBtn.addEventListener('click', bonk)

class Star {
    constructor () {
        let currentClass = ranDumb(1, 10000)/100
        for(let j = 0;j < starTypeArr.length;j++) {
            if (currentClass <= starTypeArr[j].frequency) { //using Math.random I generate the stats of the stars.
                this.temperature = ranDumb(starTypeArr[j].minTemp, starTypeArr[j].maxTemp)
                this.starMass = ranDumb(starTypeArr[j].minMass, starTypeArr[j].maxMass)
                break
            }
        }
        this.starRadius = calcStarRadius(this.starMass)
        this.starLuminosity = calcStarLuminosity(this.temperature)
        this.starClass = classifyStar(this.temperature)
        this.starHabitableZone = calcHabitableZone(this.temperature, this.starRadius * solarRadius)
    }
}

class Planet {
    constructor (starObj) {
        this.starOrbiting = starObj
        let minDistance = (.01 * AU) * (starObj.temperature/solarTemp)
        let maxDistance = (15 * AU) * (starObj.temperature/solarTemp)
        this.bodySemiMajorAxis = ranDumb(minDistance, maxDistance)
        this.bodySemiMajorAxisAU = this.bodySemiMajorAxis / AU
        this.bodyRadius = ranDumb(600, 9999) // PLACEHOLDER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.bodyTemperature = calcBodyTempSolar(starObj.temperature, (starObj.starRadius * solarRadius), this.bodySemiMajorAxis)
        this.bodyComposition = clacBodyComposition()
        this.bodyType = calcBodyTypeFirstPass(this.bodyTemperature, this.bodyRadius, this.bodyComposition)
        this.bodyAtmosphere = calcBodyAtmosphere(this.bodyTemperature, this.bodyType, this.bodySemiMajorAxis)
        this.bodyTemperature = calcBodyTempAtmosphere(this.bodyTemperature, this.bodyAtmosphere)
        //this.bodyType = calcBodyTypeSecondPass()
        this.bodyComposition = calcIceBlast(this)
        this.bodyMass = calcBodyMass(this.bodyRadius, this.bodyComposition)
        this.bodyEarthMasses = this.bodyMass / earthMass
        this.bodyRotationPeriod = "wizard MATH"
        this.bodyOrbitalPeriod = calcOrbitalPeriod(this.bodyMass, (this.starOrbiting.starMass * solarMass), this.bodySemiMajorAxis)
        this.bodyMoons = 0
        this.bodyRings = 0
        this.bodyGravity = calcBodyGravity(this.bodyMass, this.bodyRadius)
        // this.bodyXPosition = 0
        // this.bodyYPosition = 0
        // this.bodyZPosition = 0
        let animationSection = planetBoxEle
        this.planetX = document.createElement("div")
        this.bodyName = `planet${planetNumber}`
        this.planetX.setAttribute('id', this.bodyName)
        animationSection.appendChild(this.planetX)
        // let childrenplanets = animationSection.children
        childrenplanets[planetNumber].style.background = getRandomColor()
        this.displayRadius = (this.bodySemiMajorAxisAU * (500/14))
        this.offset = 500
        this.orbitalSpeed = (365/this.bodyOrbitalPeriod) * 7
        this.timer = null
        this.planetHTML = document.getElementById(this.bodyName)
        clearInterval(this.timer)
        this.bodyXPosition = 0
        this.bodyYPosition = 0
        this.cease = false
        this.timer = setInterval(frame, 5, this);
        function frame(obj) {
            if(obj.bodyXPosition === 1 || obj.cease) {
                clearInterval(this.timer)
            } else {
                obj.bodyXPosition += obj.orbitalSpeed / 100
                obj.bodyYPosition += obj.orbitalSpeed / 100
                document.getElementById(obj.bodyName).style.left = Math.cos(obj.bodyXPosition) * obj.displayRadius + obj.offset + 'px'
                document.getElementById(obj.bodyName).style.top = Math.sin(obj.bodyYPosition) * obj.displayRadius + obj.offset + 'px'
            }
        }
        // setOrbit(this.offset, this.offset, this.bodyName, , this.orbitalSpeed)
        document.getElementById(this.bodyName).addEventListener('click', function () {clickPresent(this)})
        planetNumber++
    }
    orbitSet() {
        this.orbitalSpeed = (365/this.bodyOrbitalPeriod) * 7
        this.bodySemiMajorAxisAU = this.bodySemiMajorAxis / AU
        this.displayRadius = (this.bodySemiMajorAxisAU * (500/14))
        setOrbit(this.offset, this.offset, this.bodyName, this.displayRadius, this.orbitalSpeed)
    }
    // orbitRestart() {
    //     setOrbit(this.offset, this.offset, this.bodyName, this.displayRadius, this.orbitalSpeed)
    // }
    orbitRestart() {
        this.timer = setInterval(frame, 5, this);
        function frame(obj) {
            if(obj.bodyXPosition === 1 || obj.cease) {
                clearInterval(this.timer)
            } else {
                obj.bodyXPosition += obj.orbitalSpeed / 100
                obj.bodyYPosition += obj.orbitalSpeed / 100
                document.getElementById(obj.bodyName).style.left = Math.cos(obj.bodyXPosition) * obj.displayRadius + obj.offset + 'px'
                document.getElementById(obj.bodyName).style.top = Math.sin(obj.bodyYPosition) * obj.displayRadius + obj.offset + 'px'
            }
        }
    }
    presentInfo () {
        let stats = [
            `Planet Info`,
            `Name: ${this.bodyName}`,
            `Type: ${this.bodyType}`,
            `Physical Info:`,
            `Composition: ${this.bodyComposition}`,
            `Temperature: ${this.bodyTemperature}`,
            `Size (Relative to Earth): ${this.bodyRadius/earthRadius}`,
            `Mass (kg): ${this.bodyMass}`,
            `Earth Masses: ${this.bodyEarthMasses}`,
            `Gravity: ${this.bodyGravity}`,
            `Orbital Info:`,
            `SemiMajorAxis: ${this.bodySemiMajorAxis}`,
            `SemiMajorAxisAU: ${this.bodySemiMajorAxisAU}`,
            `Orbital Period (Earth Days): ${this.bodyOrbitalPeriod}`
        ]
        let panel = document.getElementById('planetStatDisplay').children
        for (let i = 0; i < panel.length; i++) {
            panel[i].innerHTML = stats[i]
        }
    }
    changeOrbitSMA(newSMA) {
        this.bodySemiMajorAxis = newSMA
        this.bodyOrbitalPeriod = calcOrbitalPeriod(this.bodyMass, (this.starOrbiting.starMass * solarMass), this.bodySemiMajorAxis)
        this.bodyTemperature = calcBodyTempSolar(this.starOrbiting.temperature, (this.starOrbiting.starRadius * solarRadius), this.bodySemiMajorAxis)
        this.bodyType = calcBodyTypeFirstPass(this.bodyTemperature, this.bodyRadius, this.bodyComposition)
        this.bodyComposition = calcIceBlast(this)
        this.orbitCheck()
    }

}


let star = new Star()
console.log(star)
// let planet = new Planet(star)
// console.log(planet)

// movePlanet(500, 500, "planet1", 500, 0.01)

function addPlanet() {
    createNBodies(1, star)
}

planetGenButton.addEventListener('click', addPlanet)

function createNBodies(bodyNum, starObj) {
    let newBodies = []
    for(let i = 0;i<bodyNum;i++) {
        newBodies.push(new Planet(starObj))
        jsBodies.push(newBodies[i])
    }
    return newBodies
}


//testing math here.


// let planets = createNBodies(10, star)
// console.log(createNBodies(20, star))
// console.log(planets)
// let planets = createRandomPlanets(1, star)

// console.log(star)
// console.log(star[0].starHabitableZone[0]/AU)
// console.log(planets[0].semiMajorAxis/AU)
// console.log(planets[0].temperature)


