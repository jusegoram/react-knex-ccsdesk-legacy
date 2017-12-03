//CCS_UNIQUE 5VWIKS6M4L4
exports.up = function(knex) {
  return knex.schema.createTable('error_codes', table => {
    table.increments('id').primary()
    table.string('code')
    table.text('description')
    table.text('resolution')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('error_codes')
}
