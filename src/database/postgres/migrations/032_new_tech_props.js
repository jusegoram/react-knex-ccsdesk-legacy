exports.up = knex =>
  knex.schema
  .raw('CREATE EXTENSION postgis')
  .then(() =>
    knex.schema.table('techs', table => {
      table.string('skills')
      table.string('schedule')
      table.float('coverage_radius')
      table.float('efficiency')
    })
  )
  .then(() => knex.schema.raw('ALTER TABLE "techs" ADD COLUMN start_location geography(POINT,4326)'))

exports.down = knex =>
  knex.schema.table('techs', table => {
    table.dropColumn('skills')
    table.dropColumn('schedule')
    table.dropColumn('start_location')
    table.dropColumn('coverage_radius')
    table.dropColumn('efficiency')
  })
