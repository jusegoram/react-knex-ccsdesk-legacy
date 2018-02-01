exports.up = knex => {
  return knex.schema.createTable('aiq', table => {
    table.increments('id')
    table.date('date')
    table.string('subcontractor')
    table.string('service_region')
    table.string('team_id')
    table.string('tech_id')
    table.string('type')
    table.string('subtype')
    table.integer('numerator')
    table.integer('denominator')
    table.string('tech_name')
    table.string('team_name')
  })
}

exports.down = knex => knex.schema.dropTable('aiq')
