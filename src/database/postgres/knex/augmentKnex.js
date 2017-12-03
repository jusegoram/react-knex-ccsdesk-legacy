//CCS_UNIQUE 4Q71CIGEDSB
const _ = require('lodash')
const QueryBuilder = require('knex/lib/query/builder')
const Raw = require('knex/lib/raw')

const methods = {
  upsert: function(object) {
    return {
      withConstraints: (constraints = [], options = {}) => {
        const insert = this.insert(object)
        const update = new QueryBuilder(this.client).update(object)
        const constraintRawString = '(' + new Array(constraints.length).fill('??').join(', ') + ')'
        const bindings = [insert].concat(constraints).concat([update])
        const conflictWhereClause = !options.where ? '' : ` WHERE ${options.where}`
        return new Raw(this.client)
        .set(`? ON CONFLICT ${constraintRawString}${conflictWhereClause} DO ? returning *`, bindings)
        .get('rows')
        .get(0)
      },
    }
  },
}

module.exports = knex => {
  _.assign(QueryBuilder.prototype, methods)
  _.assign(knex, methods)
  _.bindAll(knex, _.functions(methods))
  return knex
}
