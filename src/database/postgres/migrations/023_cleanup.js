exports.up = (knex, Promise) => {
  return Promise.resolve()
  .then(() => knex.schema.dropTable('comment'))
  .then(() => knex.schema.dropTable('counter'))
  .then(() => knex.schema.dropTable('deleted'))
  .then(() => knex.schema.dropTable('groups_rel'))
  .then(() => knex.schema.dropTable('post'))
  .then(() => knex.schema.dropTable('users'))
  .then(() => knex.schema.dropTable('groups'))
  .then(() => knex.schema.dropTable('clients'))
}

exports.down = (knex, Promise) => Promise.resolve()
