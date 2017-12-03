exports.up = knex =>
  knex.schema.dropTable('activities').then(() =>
    knex.schema.createTable('daily_activities', table => {
      table.date('date')
      table.string('activity_number')
      table.string('source')
      table.string('company')
      table.string('status')
      table.jsonb('data')
    })
  )

exports.down = (knex, Promise) => Promise.resolve()
