exports.up = knex => {
  return knex.schema
  .dropTable('auth_local')
  .then(() => knex.schema.dropTable('auth_facebook'))
  .then(() => knex.schema.dropTable('auth_certificate'))
  .then(() =>
    knex.schema.table('user', table => {
      table.string('email')
      table.string('first_name')
      table.string('last_name')
      table.string('password')
      table.string('role')
      table.dropColumn('is_active')
      table.dropColumn('is_admin')
      table.dropColumn('username')
    })
  )
}

exports.down = () => Promise.resolve()
