exports.up = knex =>
  knex.schema.table('sdcr', table => {
    table.string('dwelling_type')
    table.string('activity_number')
  })

exports.down = knex =>
  knex.schema.table('sdcr', table => {
    table.dropColumn('dwelling_type')
    table.dropColumn('activity_number')
  })
