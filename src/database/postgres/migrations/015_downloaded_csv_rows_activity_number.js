exports.up = (knex, Promise) =>
  knex.schema.table('downloaded_csv_rows', table => {
    table.string('activity_number').after('csv_cid')
    table.index('activity_number')
  })

exports.down = (knex, Promise) =>
  knex.schema.table('downloaded_csv_rows', table => {
    table.dropColumn('activity_number')
  })
