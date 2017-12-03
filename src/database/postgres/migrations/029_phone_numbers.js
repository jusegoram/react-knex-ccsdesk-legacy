exports.up = knex =>
  knex.schema.table('user', table => {
    table.string('phone_number')
  })

exports.down = () => Promise.resolve()
