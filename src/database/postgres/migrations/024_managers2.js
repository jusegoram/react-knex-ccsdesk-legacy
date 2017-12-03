exports.up = knex => {
  return knex.schema.dropTable('managers').then(() =>
    knex.schema.createTable('managers', table => {
      table.increments('id')
      table.string('company')
      table.string('title')
      table.string('first_name')
      table.string('last_name')
      table.string('phone_number')
      table.string('email').unique()
      table.jsonb('group_names')
      table.jsonb('groups')
    })
  )
}

exports.down = (knex, Promise) => Promise.resolve()
