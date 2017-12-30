exports.up = knex =>
  knex.schema.table('sdcr', table => {
    table.index('dwelling_type')
    table.index('activity_number')
  })

exports.down = knex => knex.schema.table('sdcr', table => {})
