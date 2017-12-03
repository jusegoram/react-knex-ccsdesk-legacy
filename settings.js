//CCS_UNIQUE Y5Q7YBVNIF
require('dotenv/config')
const _ = require('lodash')
const modules = require('./config')

const envSettings = Object.assign(
  {},
  _.pickBy(modules, (v, k) => k !== 'env'),
  _.get(modules, 'env.' + process.env.NODE_ENV)
)

export default envSettings
