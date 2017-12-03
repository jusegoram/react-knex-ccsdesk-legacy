//CCS_UNIQUE I3GKZF4UH1
/* eslint import/no-extraneous-dependencies: 0 */
require('babel-register')({ presets: ['env', 'stage-3'] })
require('babel-polyfill')
const knexdata = require('./knexdata')

module.exports = knexdata
