exports.up = knex => {
  return knex.schema.createTable('companies', table => {
    table.string('name').primary()
    table.jsonb('subcontractors').defaultTo('[]')
  })
}

exports.down = knex => knex.schema.dropTable('companies')
