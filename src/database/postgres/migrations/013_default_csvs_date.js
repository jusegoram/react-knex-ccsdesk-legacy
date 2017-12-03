exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.table('downloaded_csvs', table => {
      table
      .date('downloaded_on')
      .alter()
      .defaultTo(knex.raw("(now() at time zone 'America/Chicago')::Date"))
    }),
  ])

exports.down = (knex, Promise) => Promise.resolve()
