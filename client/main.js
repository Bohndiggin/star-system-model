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

import {ranDumb, getRandomColor, makeSGP, AUConvert, calcOrbitalSpeed, calcOrbitalSpeedKmps, calcOrbitalPeriod, calcGravitationalForce, calcStarRadius, calcStarLuminosity, calcHabitableZone, classifyStar, calcBodyTempSolar, clacBodyComposition, calcBodyTypeFirstPass, calcBodyTypeSecondPass, calcBodyAtmosphere, calcBodyTempAtmosphere, calcIceBlast, calcBodyMass, calcBodyGravity} from '/utils';

let planetNumber = 0
let jsBodies = []
let displayElement = document.querySelector('display')
let planetGenButton = document.getElementById('addPlanet')
let listButton = document.getElementById('listPlanets')
let bonkBtn = document.getElementById('bonk')
let ffBtn = document.getElementById('ff')
let rvBtn = document.getElementById('rv')
let benchBtn = document.getElementById('bench')
let panel = document.getElementById('stat-display')
let editBtn = document.getElementById('edit')
let editStpBtn = document.getElementById('editStop')

let cease = false
let timePeriod = 10
let zoomLevel = 10000
let displayLevel = 500/zoomLevel
let playBtn = document.getElementById('play')
let stopBtn = document.getElementById('stop')
let rowMap = document.getElementById('row-map')
let childrenMap = rowMap.children
let unrealFactor = 500
let editMode = false

let localURL = ''


const app = new PIXI.Application ( {
    width: 1000,
    height: 1000,
    antialias: true
})
// app.stage.interactive = true

let starView = document.getElementById('newCanvas')

starView.appendChild(app.view)


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
    new StarTypes(10000, 30000, 'B', 2.1, 16, 1.8, 30000, 25, 0.25),
    new StarTypes(7500, 10000, 'A', 1.4, 2.1, 1.4, 1.8, 5, 25, 0.85),
    new StarTypes(6000, 7500, 'F', 1.04, 1.4, 1.15, 1.4, 1.5, 5, 3.85),
    new StarTypes(5200, 6000, 'G', 0.8, 1.04, 0.96, 1.15, 0.6, 1.5, 10),
    new StarTypes(3700, 5200, 'K', 0.45, 0.8, 0.7, 0.96, 0.08, 0.6, 22.1),
    new StarTypes(2400, 3700, 'M', 0.08, 0.45, 0.00001, 0.07, 0.00001, 0.08, 100)
]

function allStop() {
    timePeriod = 0
}

stopBtn.addEventListener('click', allStop)

function allGo() {
    timePeriod = 7
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
            // console.log(`found ${jsBodies[i].bodyName}`)
            bodyCaught = jsBodies[i]
            break            
        } 
    }
    for (let i = 0; i < jsBodies.length; i++) {
        jsBodies[i].selected = false        
    }
    bodyCaught.selected = true
    bodyCaught.presentInfo()
}

function clickPresentStar(event) {
    for (let i = 0; i < jsBodies.length; i++) {
        jsBodies[i].selected = false        
    }
    star.showStarStats()
}

bonkBtn.addEventListener('click', bonk)


class Star {
    constructor () {
        let currentClass = ranDumb(1, 10000)/100
        for(let j = 0;j < starTypeArr.length;j++) {
            if (currentClass <= starTypeArr[j].frequency) { //using Math.random I generate the stats of the stars.
                this.temperature = 5700//ranDumb(starTypeArr[j].minTemp, starTypeArr[j].maxTemp)
                this.starMass = 1 //ranDumb(starTypeArr[j].minMass, starTypeArr[j].maxMass)
                break
            }
        }
        this.starRadius = calcStarRadius(this.starMass)
        this.starKmRadius = this.starRadius * solarRadius
        this.starKgMass = this.starMass * solarMass
        this.starLuminosity = calcStarLuminosity(this.temperature)
        this.starClass = classifyStar(this.temperature)
        this.starHabitableZone = calcHabitableZone(this.temperature, this.starRadius * solarRadius)
        this.starDiv = document.getElementById('star')
        this.starDiv.addEventListener('click', clickPresentStar)
        let send = {tempColor: this.temperature}
        axios.post(localURL + '/api/starColor', send)
            .then(res => {
                this.starColor = res.data.starColor
                this.starColorHex = res.data.starColorHex
                this.starColorNum = res.data.starColorNum
                this.starDisplayRadius = (this.starRadius * (solarRadius / earthRadius) * displayLevel)/unrealFactor
                this.hZRadiusClose = (this.starHabitableZone[0] / AU) * displayLevel * unrealFactor
                this.hZRadiusFar = (this.starHabitableZone[1] / AU) * displayLevel * unrealFactor
                this.display = new PIXI.Graphics()
                this.display.lineStyle(0)
                this.display.beginFill(this.starColor)
                this.display.drawCircle(500, 500, this.starDisplayRadius)
                this.display.endFill()
                app.stage.addChild(this.display)
                this.displayHZFar = new PIXI.Graphics()
                this.displayHZFar.lineStyle(1, this.starColorNum)
                this.displayHZFar.drawCircle(500, 500, this.hZRadiusFar)
                this.displayHZFar.endFill()
                app.stage.addChild(this.displayHZFar)
                this.displayHZClose = new PIXI.Graphics()
                this.displayHZClose.lineStyle(1, this.starColorNum)
                this.displayHZClose.drawCircle(500, 500, this.hZRadiusClose)
                this.displayHZClose.endFill()
                app.stage.addChild(this.displayHZClose)
                this.starDiv.style.backgroundColor = this.starColorHex
            })
            .catch(err => {
                console.log(err)
            })
        let sendStar = {
            sendStarTemp: this.temperature,
            sendStarRadius: this.starRadius,
            sendStarMass: this.starMass,
            sendStarLum: this.starLuminosity
        }
        axios.post(localURL + '/api/starAdd/', sendStar)
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    showStarStats() {
        let stats = `<h2 id="planetInfo">Planet Info</h2>
            <p>Type: ${this.starClass}</pid=>
            <h4>Physical Info:</h4>
            <p>Composition: TODO</pid=>
            <p>Temperature: ${this.temperature}</pid=>
            <p>Size (Relative to Sol): ${this.starRadius}</p>
            <p>Mass (relative to Sol): ${this.starMass}</p>
            <p>Luminosity (relative to Sol): ${this.starLuminosity}</p>
            <p>masstotal = TODO</p>
            <p>Gravity: ${this.bodyGravity}</pid=>
            <h4>Orbital Info:</h4>
            <p>Habitable Zone (near): ${this.starHabitableZone[0]}</p>
            <p>Habitable Zone (far): ${this.starHabitableZone[1]}</p>
            <p>Habitable Zone (near AU): ${this.starHabitableZone[0]/AU}</p>
            <p>Habitable Zone (far AU): ${this.starHabitableZone[1]/AU}</p>`
        panel.innerHTML = stats
    }
}


class Planet {
    constructor (starObj) {
        this.starOrbiting = starObj
        this.eccentricity = ranDumb(0.001, 0.999)
        this.bodyRadius = ranDumb(600, 9999) // PLACEHOLDER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.bodyComposition = clacBodyComposition()
        //this.bodyType = calcBodyTypeSecondPass()
        this.bodyComposition = calcIceBlast(this)
        this.bodyMass = calcBodyMass(this.bodyRadius, this.bodyComposition)
        this.bodyEarthMasses = this.bodyMass / earthMass
        this.sGP = makeSGP(this.bodyMass, (this.starOrbiting.starKgMass))
        let minDistance = (.005 * AU) * (this.starOrbiting.temperature/solarTemp)
        let maxDistance = (7 * AU) * (this.starOrbiting.temperature/solarTemp)
        this.bodySemiMajorAxis = ranDumb(minDistance, maxDistance)
        this.bodySemiMajorAxisAU = this.bodySemiMajorAxis / AU
        this.bodySemiMinorAxis = this.bodySemiMajorAxis * Math.sqrt(1 - this.eccentricity**2)
        this.bodyVelocity = calcOrbitalSpeedKmps(this.bodyMass, this.starOrbiting.starKgMass, this.bodySemiMajorAxis)
        this.angularMomentum = this.bodyMass * this.bodyVelocity * this.bodySemiMajorAxis
        this.specificAngularMomentum = this.angularMomentum / this.bodyMass
        this.bodyRotationPeriod = "wizard MATH"
        this.bodyOrbitalPeriod = calcOrbitalPeriod(this.bodyMass, (this.starOrbiting.starKgMass), this.bodySemiMajorAxis)
        this.bodyTemperature = calcBodyTempSolar(this.starOrbiting.temperature, (this.starOrbiting.starKmRadius), this.bodySemiMajorAxis)
        this.bodyType = calcBodyTypeFirstPass(this.bodyTemperature, this.bodyRadius, this.bodyComposition)
        this.bodyAtmosphere = calcBodyAtmosphere(this.bodyTemperature, this.bodyType, this.bodySemiMajorAxis)
        this.bodyTemperature = calcBodyTempAtmosphere(this.bodyTemperature, this.bodyAtmosphere)
        this.bodyParameter = ((this.specificAngularMomentum ** 2) / this.sGP)
        this.bodyPeriapsis = this.bodySemiMajorAxis * (1-this.eccentricity)
        this.bodyApoapsis = this.bodySemiMajorAxis * (1+this.eccentricity)
        this.bodyF = this.bodySemiMajorAxis * this.eccentricity
        this.bodyOrbitalPeriod = 2 * Math.PI * Math.sqrt(this.bodySemiMajorAxis**3 / this.sGP)
        this.bodyMoons = 0
        this.bodyRings = 0
        this.bodyGravity = calcBodyGravity(this.bodyMass, this.bodyRadius)
        let animationSection = rowMap
        this.planetColor = getRandomColor()
        this.planetX = document.createElement("div")
        this.bodyName = `planet${planetNumber}`
        this.planetX.setAttribute('id', this.bodyName)
        this.planetX.setAttribute('class', 'planet')
        animationSection.appendChild(this.planetX)
        childrenMap[planetNumber+1].style.background = this.planetColor.hex
        this.displayRadius = (this.bodySemiMajorAxisAU * displayLevel)
        this.bodyDisplayRadius = this.bodyRadius * (earthRadius/solarRadius) * displayLevel
        this.offset = 500
        this.orbitalSpeed = (365/this.bodyOrbitalPeriod)
        this.planetHTML = document.getElementById(this.bodyName)
        this.bodyXOrbitJourney = 0
        this.bodyYOrbitJourney = 0
        this.bodyXLocation = 500
        this.bodyYLocation = 500
        this.bodyCurrTemp = 0
        this.cease = false
        this.bodyRadiusEarth = this.bodyRadius/earthRadius
        this.bodyLocations = [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]]
        this.display = new PIXI.Graphics()
        this.display.lineStyle(0)
        this.display.beginFill(this.planetColor.num)
        this.display.drawCircle(0, 0, this.bodyDisplayRadius)
        this.display.interactive = true
        this.display.buttonMode = true
        this.display.filters = [new PIXI.filters.GlowFilter({distance: 10, outerStrength: 0})]
        this.display.endFill()
        this.display.on('pointerdown', onDragStart)
        // this.display.on('pointerdown', clickPresent)
        this.display.on('pointerup', onDragEnd)
        this.display.on('pointerupoutside', onDragEnd)
        this.display.on('pointermove', onDragMove)
        app.stage.addChild(this.display)
        document.getElementById(this.bodyName).addEventListener('click', function () {clickPresent(this)})
        console.log(this.bodyName)
        let staged = {
            stagedSMA: this.bodySemiMajorAxis,
            stagedSMAAU: this.bodySemiMajorAxisAU,
            stagedName: this.bodyName,
            stagedRadius: this.bodyRadius,
            stagedEcc: this.eccentricity,
            stagedTemp: this.bodyTemperature,
            stagedType: this.bodyType
        }
        axios.get(localURL + '/api/starNumGet/') //gotta send the star over first and wait for it to process
             .then(res => {
                this.starOrbiting.starNum = res.data[0].count
                staged.stagedStarNum = +res.data[0].count
                axios.post(localURL + '/api/planetAdd', staged)
                    .then(res => {
                        let pAndS = {
                            s: staged.stagedStarNum,
                            p: +res.data[0].count
                        }
                        axios.post(localURL + '/api/star-system', pAndS)
                            .then(res => {
                            })
                            .catch(err => console.log(err))
                    })
                    .catch((err) => console.log('error on planet Gen: ' + err))
            })
            .catch(err => console.log('error' + err))
        planetNumber++
    }
    updateTemperature(distance) {
        this.bodyCurrTemp = calcBodyTempSolar(this.starOrbiting.temperature, (this.starOrbiting.starKmRadius), distance)
    }
    updateLocation() {
        this.displayXRadius = ((this.bodySemiMajorAxisAU * (1 - this.eccentricity**2)))/(1+this.eccentricity*Math.cos(this.bodyXOrbitJourney))
        this.currBodyDistance = (((this.bodySemiMajorAxisAU * (1 - this.eccentricity**2))/(1+this.eccentricity*Math.cos(this.bodyXOrbitJourney))))
        this.currBodySpeed = ((Math.sqrt(this.sGP * ((2/this.currBodyDistance)-(1/this.bodySemiMajorAxisAU))))/unrealFactor) * timePeriod / (unrealFactor/5)
        this.bodyXOrbitJourney += this.currBodySpeed / AU
        this.bodyXLocation = ((((this.bodySemiMajorAxis * Math.cos(this.bodyXOrbitJourney)- this.bodyF) / AU) * unrealFactor) * displayLevel) + this.offset
        this.bodyYLocation = (((this.bodySemiMinorAxis * Math.sin(this.bodyXOrbitJourney) / AU) * unrealFactor) * displayLevel) + this.offset
        this.bodyLocations.shift(0)
        this.bodyLocations.push([this.bodyXLocation, this.bodyYLocation])
        if(!this.dragging) {
            this.display.position.x = this.bodyXLocation
            this.display.position.y = this.bodyYLocation
        }
        this.updateTemperature(this.currBodyDistance * AU)
        this.presentInfo()
    }
    presentInfo () {
        if(this.selected) {
            if(!editMode) {
                let stats = `<h2 id="planetInfo">Planet Info</h2>
                <h3 id="planetName">Name: ${this.bodyName}</h3>
                <p id="planet type">Type: ${this.bodyType}</p>
                <h4 id="planetPhysicalInfo">Physical Info:</h4>
                <p id="planetComposition">Composition: ${this.bodyComposition}</p>
                <p id="planetTemperature">Temperature: ${this.bodyTemperature}</p>
                <p id="planetSizeEarths">Size (Relative to Earth): ${this.bodyRadius/earthRadius}</p>
                <p id="planetMassKg">Mass (Kg): ${this.bodyMass}</p>
                <p id="planetMassEarths">Earth Masses: ${this.bodyMass/earthMass}</p>
                <p id="planetG">Gravity: ${this.bodyGravity}</p>
                <h4 id="orbitalInfo">Orbital Info:</h4>
                <p id="semiMajorAxis">SemiMajorAxis: ${this.bodySemiMajorAxis}</p>
                <p id="semiMajorAxisAU">SemiMajorAxisAU: ${this.bodySemiMajorAxisAU}</p>
                <p id="orbitalPeriod">Orbital Period (Earth Days): ${this.bodyOrbitalPeriod}</p>
                <p>Apoapsis: ${this.bodyApoapsis}</p>
                <p>Periapsis: ${this.bodyPeriapsis}</p>
                <p>CUR ECC: ${this.eccentricity}</p>
                <p>CUR DIST: ${Math.floor(this.currBodyDistance * AU)}</p>
                <p>CURR TEMP: ${Math.floor(this.bodyCurrTemp)}</p>
                <p>CURR SPD: ${Math.floor(this.currBodySpeed)}</p>`
                panel.innerHTML = stats
            } else {
                let eccInput, eccSlider, smaSlider, smaInput = null
                this.editable = [
                    {
                        slider: {var: eccSlider, str: 'eccentricity-slider'},
                        input: {var: eccInput, str: 'ecc-input'}
                    },
                    {
                        slider: {var:  smaSlider, str: 'sma-AU-slider'},
                        input: {var: smaInput, str: 'sma-AU-input'}
                    }
                ]
                let stats = `<h2 id="planetInfo">Planet Info</h2>
                <h3 id="planetName">Name: ${this.bodyName}</h3>
                <p id="planet type">Type: ${this.bodyType}</p>
                <h4 id="planetPhysicalInfo">Physical Info:</h4>
                <p id="planetComposition">Composition: ${this.bodyComposition}</p>
                <p id="planetTemperature">Temperature: ${this.bodyTemperature}</p>
                <p id="planetSizeEarths">Size (Relative to Earth): ${this.bodyRadius/earthRadius}</p>
                <p id="planetMassKg">Mass (Kg): ${this.bodyMass}</p>
                <p id="planetMassEarths">Earth Masses: ${this.bodyMass/earthMass}</p>
                <p id="planetG">Gravity: ${this.bodyGravity}</p>
                <h4 id="orbitalInfo">Orbital Info:</h4>
                <p id="semiMajorAxis">SemiMajorAxis: ${this.bodySemiMajorAxis}</p>
                <p id="semiMajorAxisAU">SemiMajorAxisAU: ${this.bodySemiMajorAxisAU}</p>
                <input type="range" name="semi-major-axis-AU" id="sma-AU-slider" min="0.001" max="10" value="${this.bodySemiMajorAxisAU}" step="0.1">
                <label for="semi-major-axis-AU">semi-major-axis-AU</label>
                <input type="text" id="sma-AU-input" name="semi-major-axis-AU" min="0.001" max="10" placeholder="${this.bodySemiMajorAxisAU}">
                <p id="orbitalPeriod">Orbital Period (Earth Days): ${this.bodyOrbitalPeriod}</p>
                <p>Apoapsis: ${this.bodyApoapsis}</p>
                <p>Periapsis: ${this.bodyPeriapsis}</p>
                <p>CUR ECC: ${this.eccentricity}</p>
                <input type="range" name="eccentricity" id="eccentricity-slider" min="0.001" max="0.999" value="${this.eccentricity}" step="0.001">
                <label for="eccentricity">eccentricity</label>
                <input type="text" id="ecc-input" name="eccentricity" min="0.001" max="0.999" placeholder="${this.eccentricity}">
                <p>CUR DIST: ${Math.floor(this.currBodyDistance * AU)}</p>
                <p>CURR TEMP: ${Math.floor(this.bodyCurrTemp)}</p>
                <p>CURR SPD: ${Math.floor(this.currBodySpeed)}</p>
                <label for="submit-changes">Submit Changes:</label>
                <input type="button" value="Submit" id="submitChange" name="submit-changes">`
                panel.innerHTML = stats
                for (let i = 0; i < this.editable.length; i++) { //takes the array of editable and makes sliders for each variable in it
                    this.editable[i].slider.var = document.getElementById(this.editable[i].slider.str)
                    this.editable[i].input.var = document.getElementById(this.editable[i].input.str)
                    this.editable[i].input.var.innerHTML = this.editable[i].slider.var.value
                    this.editable[i].slider.var.oninput = () => {
                        this.editable[i].input.var.value = this.editable[i].slider.var.value
                    }
                }
                let editSendBtn = document.getElementById('submitChange')
                editSendBtn.addEventListener('click', () => {
                    let edited = {
                        ecc: this.editable[0].input.var.value,
                        smaAU: this.editable[0].input.var.value
                    }
                    this.bodyEdit(edited)
                })
            }
        }
    }
    update() {
        if(this.selected) {
            this.display.filters[0].outerStrength = 5
        } else {
            this.display.filters[0].outerStrength = 0
        }
    }
    bodyEdit(edited) { //how to account for the various ways they can be changed?
        //step 1. Compare 'this' to new values 
        //step 2. gather changes and send 'this' and changed
        //step 3. determine what needs to change on the back end.
        let staged = {
            stagedSMA: this.bodySemiMajorAxis,
            stagedSMAAU: this.bodySemiMajorAxisAU,
            stagedName: this.bodyName,
            stagedRadius: this.bodyRadius,
            stagedEcc: this.eccentricity,
            stagedTemp: this.bodyTemperature,
            stagedType: this.bodyType
        }
        let stagedAndChanges = {
            curr: staged,
            changes: edited
        }
        axios.post(localURL + '/api/edit', stagedAndChanges)
        .then((res) =>{
            console.log(res.data)
            this.eccentricity = res.data.resECC
            this.bodySemiMajorAxisAU = res.data.resSMAAU
            this.bodySemiMajorAxis = this.bodySemiMajorAxisAU * AU
            this.bodySemiMinorAxis = this.bodySemiMajorAxis * Math.sqrt(1 - this.eccentricity**2)
        })
        .catch((err) => {
            console.log('bodyEdit had ' + err)
        })
    }
}

let star = new Star()

function addPlanet() {
    createNBodies(1, star)
}

planetGenButton.addEventListener('click', addPlanet)

function onDragStart(event) {
    this.data = event.data
    this.alpha = 0.5
    this.dragging = true
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

function createNBodies(bodyNum, starObj) {
    let newBodies = []
    for(let i = 0;i<bodyNum;i++) {
        newBodies.push(new Planet(starObj))
        jsBodies.push(newBodies[i])
    }
    //axios send over the star data
    return newBodies
}

function update() {
    let timer = null
    timer = setInterval(frame, 5)
    function frame() {
        for(let i = 0;i<jsBodies.length;i++) {
            if(jsBodies[i].bodyXPosition === 1) {
                clearInterval(timer)
            } else  if (!editMode) { 
                jsBodies[i].updateLocation()
                jsBodies[i].update()
            } else {
                jsBodies[i].update()
            }
        }
    }
}

function fastForward() {
    timePeriod++
}

function zoomIn() {
    zoomLevel -= 500
    displayLevel = (500/zoomLevel)
}

ffBtn.addEventListener('click', fastForward)

function slowReverse() {
    timePeriod--
}

rvBtn.addEventListener('click', slowReverse)

function bench() {
    createNBodies(1000, star)
}

benchBtn.addEventListener('click', bench)

function editModeStart() {
    allStop()
    editMode = true
}

editBtn.addEventListener('click', editModeStart)

function editModeStop () { //collect changes and stop edit mode
    editMode = false
    allGo()
}

editStpBtn.addEventListener('click', editModeStop)


update()
//testing math here.



createNBodies(15, star)
app.start()
//notes: