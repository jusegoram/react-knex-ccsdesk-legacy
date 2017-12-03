exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.table('downloaded_csvs', table => {
      table.date('downloaded_on')
    }),
    knex.schema.createTable('activities', table => {
      table.date('imported_on')
      table.string('source')
      table.string('company')
      table.jsonb('data')
      table.string('status')
    }),
  ])

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('activities'),
    knex.schema.table('downloaded_csvs', table => {
      table.dropColumn('downloaded_on')
    }),
  ])
