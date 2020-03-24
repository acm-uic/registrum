// fileTransformer.js
const path = require('path')

module.exports = {
    process(src, filename, config, options) {
        console.log(filename)
        return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';'
    }
}
