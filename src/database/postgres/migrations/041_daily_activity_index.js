exports.up = knex =>
  knex.schema.table('daily_activities', table => {
    table.index('activity_number')
  })

exports.down = knex =>
  knex.schema.table('sdcr', table => {
    table.dropIndex('activity_number')
  })
