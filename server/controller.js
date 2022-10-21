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
        let color = `rgb(${red}, ${green}, ${blue})`
        let response = {starColor: color}
        res.status(200).send(response)
    }
}