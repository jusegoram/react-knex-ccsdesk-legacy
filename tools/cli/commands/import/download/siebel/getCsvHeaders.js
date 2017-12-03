//CCS_UNIQUE 3HQOE16VA6G
const csv = require('csv')
// it's a little hacky, but it just claims no headers then asks to stop after 1
module.exports = csvString =>
  new Promise((resolve, reject) => {
    csv.parse(
      csvString,
      {
        to: 1,
        trim: true,
        skip_empty_lines: true,
      },
      (err, data) => {
        err ? reject(err) : resolve(data[0])
      }
    )
  })
