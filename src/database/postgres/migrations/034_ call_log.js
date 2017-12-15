exports.up = knex =>
  knex.schema.createTable('call_log', table => {
    table.increments('id')
    table.integer('agent_id')
    table.string('tech_cid')
    table.text('reason')
  })

exports.down = knex => knex.schema.dropTable('call_log')
