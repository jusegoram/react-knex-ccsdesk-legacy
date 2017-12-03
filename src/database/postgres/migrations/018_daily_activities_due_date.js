exports.up = knex =>
  knex.schema.table('daily_activities', table => {
    table.date('due_date').index()
    table.string('timezone')
  })

exports.down = knex =>
  knex.schema.table('daily_activities', table => {
    table.dropColumn('due_date')
  })
