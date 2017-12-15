exports.up = knex =>
  knex.schema.createTable('call_log', table => {
    table.integer('agent_id').primary()
    table.string('tech_cid')
    table.text('reason')
  })

exports.down = knex => knex.schema.dropTable('call_log')
