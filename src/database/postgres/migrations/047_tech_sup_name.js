exports.up = knex =>
  knex.schema.table('techs', table => {
    table.string('supervisor')
  })

exports.down = knex =>
  knex.schema.table('techs', table => {
    table.dropColumn('supervisor')
  })
