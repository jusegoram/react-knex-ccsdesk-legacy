//CCS_UNIQUE 9IN5F0Z5GS
const settings = require('./settings').default

// module.exports.development = {
//   client: settings.db.client,
//   connection: settings.db.connection.development,
//   pool: settings.db.pool,
//   seeds: {
//     directory: './src/database/postgres/seeds',
//   },
//   migrations: {
//     directory: './src/database/postgres/migrations',
//   },
//   useNullAsDefault: true,
// }

module.exports.production = {
  client: settings.db.client,
  connection: settings.db.connection.production,
  pool: settings.db.pool,
  seeds: {
    directory: './src/database/postgres/seeds',
  },
  migrations: {
    directory: './src/database/postgres/migrations',
  },
  useNullAsDefault: true,
}
module.exports.development = module.exports.production
module.exports.test = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
  },
  seeds: {
    directory: './src/server/database/seeds',
  },
  migrations: {
    directory: './src/server/database/migrations',
  },
  useNullAsDefault: true,
}
