//CCS_UNIQUE PI0NGJ3FR4
// Favicon.ico should not be hashed, since some browsers expect it to be exactly on /favicon.ico URL
require('!file-loader?name=[name].[ext]!./assets/favicon.ico') // eslint-disable-line import/no-webpack-loader-syntax

// Require all files from assets dir recursively addding them into assets.json
let req = require.context('!file-loader?name=[hash].[ext]!./assets', true, /.*/)
req.keys().map(req)
