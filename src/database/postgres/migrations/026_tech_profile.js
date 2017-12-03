exports.up = knex => {
  return knex.schema.createTable('tech_profiles', table => {
    table.string('cid').primary()
    table.string('source')
    table.jsonb('data').index()
  })
}

exports.down = knex => knex.schema.dropTable('tech_profiles')
