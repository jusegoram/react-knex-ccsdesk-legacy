//CCS_UNIQUE 2VLPBEK4COY

const CsvDbRecord = require('./CsvDbRecord')
const Saturate = require('./saturate')

module.exports = async ({ knex, source, reportName, cid }) => {
  const csvDbRecord = await CsvDbRecord.getInstanceById({ knex, source, reportName, cid })
  await csvDbRecord.indicateSaturationRunning()
  try {
    await Saturate[reportName]({ knex, source, csv_cid: cid })
    await csvDbRecord.indicateSaturationCompleted()
  } catch (e) {
    await csvDbRecord.indicateSaturationErrored(e)
    throw e
  }
}
