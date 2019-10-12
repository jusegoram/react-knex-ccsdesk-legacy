//CCS_UNIQUE TLZ44M5NFZ
let DB_TYPE = 'pg'
let client = ''
let connectionDevelopment = {
  // user: 'postgres',
  // password: process.env.DB_PASSWORD,
  database: 'ccsdesk',
  multipleStatements: true,
  charset: 'utf8',
}
let connectionProduction = {
  host: 'ccsdesk.cm2jturmggw8.us-east-1.rds.amazonaws.com',
  user: 'master',
  password: process.env.DB_PASSWORD,
  database: 'ccsdesk',
  multipleStatements: true,
  charset: 'utf8',
}
let pool = {}
if (DB_TYPE === 'mysql') {
  // mysql
  client = 'mysql2'
} else if (DB_TYPE === 'pg') {
  // postgres
  client = 'pg'
} else {
  // sqlite
  client = 'sqlite3'
  connectionDevelopment = {
    filename: './dev-db.sqlite3',
  }
  connectionProduction = {
    filename: './prod-db.sqlite3',
  }
  pool = {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb)
    },
  }
}

module.exports = {
  dbType: DB_TYPE,
  client: client,
  connection: {
    development: connectionDevelopment,
    production: connectionProduction,
  },
  pool: pool,
}
