//CCS_UNIQUE WBY3G9LN7PG
const nodeTypes = ['GROUP', 'WORKER', 'MANAGER']
// After running this migration, run the following SQL commands
// TODO: incorporate these into the script

// create extension hstore;

// create or replace function simple_jsonb_to_hstore(jdata jsonb)
// returns hstore language sql immutable
// as $$
//     select hstore(array_agg(key), array_agg(value))
//     from jsonb_each_text(jdata)
// $$;

// ALTER TABLE org_nodes ALTER COLUMN parents drop default

// ALTER TABLE org_nodes ALTER COLUMN parents TYPE hstore USING simple_jsonb_to_hstore(parents);

exports.up = function(knex) {
  return knex.schema
  .createTable('clients', table => {
    table.increments('id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('name')
  })
  .createTable('users', table => {
    table.bigInteger('client_id')
    table.foreign('client_id').references('clients.id')
    table.increments('id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('username')
    table.string('password_hash')
    table.string('salt')
    table.jsonb('roles')
    table.timestamp('last_logged_in_at')
  })
  .createTable('org_nodes', table => {
    table.increments('id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.jsonb('parents').defaultTo('{}')
    table.index('parents', null, 'GIN')
    table.enum('node_class', nodeTypes)
  })
  .createTable('org_groups', table => {
    table.inherits('org_nodes')
    table.enum('node_class', nodeTypes).defaultTo('GROUP')
    table.enum('type', ['COMPANY', 'SUBCONTRACTOR', 'DMA', 'OFFICE', 'SERVICE_REGION', 'TECH_TEAM'])
    table.string('name')
    table.index(['type', 'name'])
  })
  .createTable('org_workers', table => {
    table.inherits('org_nodes')
    table.enum('node_class', nodeTypes).defaultTo('WORKER')
    table.string('employee_id').unique()
    table.string('first_name')
    table.string('last_name')
    table.index(['first_name', 'last_name'])
    table.string('phone_number')
  })
  .createTable('org_managers', table => {
    table.inherits('org_nodes')
    table.enum('node_class', nodeTypes).defaultTo('MANAGER')
    table.string('email').unique()
    table.string('first_name')
    table.string('last_name')
    table.index(['first_name', 'last_name'])
    table.string('phone_number').index()
  })
}

exports.down = function(knex) {
  return knex.schema
  .dropTable('org_managers')
  .dropTable('org_workers')
  .dropTable('org_groups')
  .dropTable('org_nodes')
  .dropTable('users')
  .dropTable('clients')
}
