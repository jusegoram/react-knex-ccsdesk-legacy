//CCS_UNIQUE LREJ7Y23JRI
exports.up = (knex, Promise) =>
  Promise.resolve()
  .then(() =>
    knex.schema.createTable('downloaded_csvs', table => {
      table.string('cid').primary()
      table.string('source')
      table.string('report_name')
      table.enum('download_status', ['Running', 'Complete', 'Errored']).defaultTo('Running')
      table.enum('saturate_status', ['Pending', 'Blocked', 'Running', 'Complete', 'Errored']).defaultTo('Pending')
      table.timestamp('started_at').defaultTo(knex.fn.now())
      table.timestamp('downloaded_at')
      table.timestamp('saturated_at')
      table.timestamp('error_at')
      table.json('error')
      table.json('header_order')
    })
  )
  .then(() =>
    knex.schema
    .createTable('downloaded_csv_rows', table => {
      table.bigIncrements('id').primary()
      table.string('csv_cid')
      table
      .foreign('csv_cid')
      .references('downloaded_csvs.cid')
      .onUpdate('CASCADE')
      table.jsonb('data')
    })
    .raw('create index "imported_rows_data_index" on "imported_rows" using gin ("data" jsonb_path_ops)')
  )

exports.down = (knex, Promise) =>
  Promise.resolve()
  .then(() => knex.schema.dropTable('imported_rows'))
  .then(() => knex.schema.dropTable('imports'))
