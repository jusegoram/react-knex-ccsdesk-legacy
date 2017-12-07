exports.up = knex =>
  knex.schema.createTable('bbe', table => {
    table.string('activity_number').primary()
    table.string('bbe_status')
    table.string('bbe_category')
  })

exports.down = knex => knex.schema.dropTable('bbe')
