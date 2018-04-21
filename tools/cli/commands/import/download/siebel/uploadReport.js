//CCS_UNIQUE 2OW440UFF6L
const Promise = require('bluebird')
const csv = require('csv')
const { Transform } = require('stream')
const KnexInsertStream = require('./KnexInsertStream')

const dataKeys = {
  Routelog: 'Activity #',
  TechProfile: 'Tech User ID',
  BBE: 'Activity Number',
  AIQNum: 'Tech User ID',
  AIQDen: 'Tech User ID',
}

module.exports = async ({ trx, reportName, cid, csvStream }) =>
  new Promise((resolve, reject) => {
    const array = []
    csvStream
    .pipe(
      csv.parse({
        columns: true,
        trim: true,
        skip_empty_lines: true,
      })
    )
    .pipe(
      new Transform({
        objectMode: true,
        transform(obj, encoding, callback) {
          const record = {
            csv_cid: cid,
            data: obj,
            data_key: obj[dataKeys[reportName]],
          }
          array.push(record)
          callback(null, record)
        },
      })
    )
    .on('data', () => {})
    .on('end', () => {
      resolve(array)
    })
    .on('error', error => {
      reject(error)
    })
  })
