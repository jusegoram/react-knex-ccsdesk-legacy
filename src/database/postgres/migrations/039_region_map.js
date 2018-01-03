exports.up = knex => {
  return knex.schema.createTable('regions', table => {
    table.increments('id')
    table.string('service_region').index()
    table.string('office')
    table.string('dma')
    table.string('division')
    table.string('hsp')
  })
}

exports.down = knex => knex.schema.dropTable('regions')
