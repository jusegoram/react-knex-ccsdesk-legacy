exports.up = knex =>
  knex.schema
  .createTable('pending_jobs', table => {
    table.increments('id')
    table.string('source')
    table.jsonb('data')
  })
  .then(() => knex.schema.raw('ALTER TABLE "pending_jobs" ADD COLUMN location geography(POINT,4326)'))

exports.down = knex => knex.schema.dropTable('pending_jobs')
