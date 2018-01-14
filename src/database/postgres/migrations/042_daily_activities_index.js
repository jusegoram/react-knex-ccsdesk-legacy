exports.up = knex =>
  knex.schema.table('daily_activities', table => {
    table.index('date')
  })

exports.down = knex =>
  knex.schema.table('daily_activities', table => {
    table.dropIndex('date')
  })
