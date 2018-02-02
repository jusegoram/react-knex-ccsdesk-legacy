//CCS_UNIQUE 2VLPBEK4COY

const path = require('path')
const CsvDbRecord = require('./CsvDbRecord')
const SiebelCredentials = require('/root/credentials/siebel') //eslint-disable-line import/no-absolute-path
const SiebelReportFetcher = require('./download/siebel/SiebelReportFetcher')
const convertStringToStream = require('./download/siebel/convertStringToStream')
const SanitizeStringStream = require('./download/siebel/SanitizeStringStream')
const uploadReport = require('./download/siebel/uploadReport')
const getCsvHeaders = require('./download/siebel/getCsvHeaders')
const Saturate = require('./saturate')

const screenshotsDirectory = path.resolve(__dirname, 'screenshots')
module.exports = async ({ knex, source, reportName }) => {
  const csvDbRecord = await CsvDbRecord.insertRowWithCurrentTime({ knex, source, reportName })
  try {
    const csvString = await new SiebelReportFetcher(SiebelCredentials[source]).fetchReport(reportName, {
      loggingPrefix: 'CCS CLI',
      screenshotsDirectory,
      screenshotsPrefix: `${source}_${reportName}`,
      horsemanConfig: {
        cookiesFile: path.join(__dirname, `${source}_cookies.txt`),
      },
    })
    // const csvString = fs.readFileSync(path.resolve(screenshotsDirectory, 'Routelog.csv`))
    const headers = await getCsvHeaders(csvString)
    const csvStream = convertStringToStream(csvString)
    const cleanCsvStream = csvStream.pipe(new SanitizeStringStream())
    await knex.transaction(async trx => {
      await csvDbRecord.setHeaders(headers)
      await uploadReport({ trx, reportName, cid: csvDbRecord.cid, csvStream: cleanCsvStream })
      await csvDbRecord.indicateDownloadCompleted()
    })
  } catch (e) {
    await csvDbRecord.indicateDownloadErrored(e)
    throw e
  }
  await csvDbRecord.indicateSaturationRunning()
  try {
    await Saturate[reportName]({ knex, source, csv_cid: csvDbRecord.cid, csv: csvDbRecord })
    await csvDbRecord.indicateSaturationCompleted()
  } catch (e) {
    await csvDbRecord.indicateSaturationErrored(e)
    throw e
  }
}

module.exports.sources = Object.keys(SiebelCredentials)
module.exports.reports = Object.keys(SiebelReportFetcher.availableReports)
