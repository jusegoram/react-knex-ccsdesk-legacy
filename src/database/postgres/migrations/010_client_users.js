//CCS_UNIQUE 7880D2VW42J
exports.up = knex =>
  knex.schema.table('user', table => {
    table.string('company')
    table.string('hsp')
  })

exports.down = knex =>
  knex.schema.table('user', table => {
    table.dropColumn('company')
    table.dropColumn('hsp')
  })
