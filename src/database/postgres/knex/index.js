// @flow
//CCS_UNIQUE GT4UDGFUL3
const Knex = require('knex')
const environments = require('../../../../knexdata')

const knex = Knex(environments[process.env.NODE_ENV])
module.exports = knex
