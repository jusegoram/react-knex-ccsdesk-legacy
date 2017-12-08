exports.up = knex =>
  knex.schema.table('daily_activities', table => {
    table.string('type')
  })

exports.down = knex =>
  knex.schema.table('daily_activities', table => {
    table.dropColumn('type')
  })
