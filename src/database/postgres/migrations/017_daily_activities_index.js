exports.up = knex =>
  knex.schema.table('daily_activities', table => {
    table.index(['date', 'activity_number'])
  })

exports.down = (knex, Promise) => Promise.resolve()
