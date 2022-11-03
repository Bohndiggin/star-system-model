const path = require('path')

module.exports = {
    entry: './client/main.js',
    output: {
        path: path.resolve(__dirname),
        filename: '_bundle.js'
    }
}