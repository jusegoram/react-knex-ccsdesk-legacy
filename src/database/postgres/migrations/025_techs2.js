exports.up = knex => {
  return knex.schema.dropTable('techs').then(() =>
    knex.schema.createTable('techs', table => {
      table.string('cid').primary()
      table.string('source').index()
      table.string('company').index()
      table.string('tech_id').index()
      table.string('first_name')
      table.string('last_name')
      table.string('phone_number')
      table.jsonb('group_names')
      table.jsonb('groups')
    })
  )
}

exports.down = (knex, Promise) => Promise.resolve()
