exports.up = (knex, Promise) =>
  knex.schema.table('activities', table => {
    table.string('activity_number').after('imported_on')
    table.index(['imported_on', 'activity_number'])
  })

exports.down = (knex, Promise) =>
  knex.schema.table('activities', table => {
    table.dropColumn('activity_number')
  })
