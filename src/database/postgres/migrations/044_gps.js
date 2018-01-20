exports.up = knex =>
  knex.schema
  .table('techs', table => {
    table.timestamp('location_recorded_at')
  })
  .then(() => knex.schema.raw('ALTER TABLE "techs" ADD COLUMN location geography(POINT,4326)'))

exports.down = knex =>
  knex.schema.table('techs', table => {
    table.dropColumn('location_recorded_at')
    table.dropColumn('location')
  })
