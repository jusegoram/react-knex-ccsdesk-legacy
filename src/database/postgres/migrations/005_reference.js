//CCS_UNIQUE NKD3GGD7SFH
exports.up = function(knex) {
  return knex.schema.createTable('reference_enums', table => {
    table.increments('id').primary()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('name')
    table.jsonb('values')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('reference_enums')
}
