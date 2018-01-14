exports.up = knex =>
  knex.schema.table('daily_activities', table => {
    table.index('status')
    table.index('type')
  })

exports.down = knex =>
  knex.schema.table('daily_activities', table => {
    table.dropIndex('status')
    table.dropIndex('type')
  })
