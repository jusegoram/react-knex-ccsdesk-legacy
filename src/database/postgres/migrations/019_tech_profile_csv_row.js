exports.up = knex => {
  return knex.schema.table('downloaded_csv_rows', table => table.renameColumn('activity_number', 'data_key'))
}

exports.down = knex => {
  return knex.schema.table('downloaded_csv_rows', table => table.renameColumn('data_key', 'activity_number'))
}
