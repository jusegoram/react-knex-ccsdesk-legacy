exports.up = knex =>
  knex.schema.table('user', table => {
    table.jsonb('techs').defaultTo('[]')
  })

exports.down = knex =>
  knex.schema.table('user', table => {
    table.dropColumn('techs')
  })
