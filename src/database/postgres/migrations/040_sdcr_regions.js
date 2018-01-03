exports.up = knex =>
  knex.schema.table('sdcr', table => {
    table.string('division')
  })

exports.down = knex =>
  knex.schema.table('sdcr', table => {
    table.dropColumn('division')
  })
