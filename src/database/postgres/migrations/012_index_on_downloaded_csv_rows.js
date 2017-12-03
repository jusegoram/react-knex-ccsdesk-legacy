exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.table('downloaded_csv_rows', table => {
      table.index('csv_cid')
    }),
  ])

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.table('downloaded_csv_rows', table => {
      table.dropIndex('csv_cid')
    }),
  ])
