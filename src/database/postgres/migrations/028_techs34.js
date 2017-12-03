exports.up = knex => {
  return knex.schema.table('user', table => {
    table.string('tech_id')
  })
}

exports.down = () => Promise.resolve()
