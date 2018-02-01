exports.up = knex =>
  knex.schema.table('techs', table => {
    table.string('supervisor_phone')
    table.jsonb('data')
  })

exports.down = knex =>
  knex.schema.table('techs', table => {
    table.dropColumn('supervisor_phone')
    table.dropColumn('data')
  })
