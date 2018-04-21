//CCS_UNIQUE 2VLPBEK4COY

const fs = require('fs')
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
  // if its running for more than two hours, force quit
  setTimeout(function() {
    process.exit()
  }, 2 * 1000 * 60 * 60)
  const csvDbRecord = await CsvDbRecord.insertRowWithCurrentTime({ knex, source, reportName })
  try {
    // const reportFetcher = new SiebelReportFetcher(SiebelCredentials[source], source)
    // const csvString = await reportFetcher.fetchReport(reportName, {
    //   loggingPrefix: 'CCS CLI',
    //   screenshotsDirectory,
    //   screenshotsPrefix: `${source}_${reportName}`,
    //   horsemanConfig: {
    //     // cookiesFile: path.join(__dirname, `${source}_cookies.txt`),
    //   },
    // })
    // console.log('closing browser')
    // await reportFetcher.close()
    // console.log('browser closed')
    const csvString =
      '' +
      fs.readFileSync(
        path.resolve(__dirname, 'download', 'siebel', 'downloaded_reports', 'Route Log - Time - Zones.csv')
      )

    const headers = await getCsvHeaders(csvString)
    const csvStream = convertStringToStream(csvString)
    const cleanCsvStream = csvStream.pipe(new SanitizeStringStream())
    await knex.transaction(async trx => {
      await csvDbRecord.setHeaders(headers)
      console.log('uploading report')
      await uploadReport({ trx, reportName, cid: csvDbRecord.cid, csvStream: cleanCsvStream })
      console.log('report uploaded')
      await csvDbRecord.indicateDownloadCompleted()
    })
    console.log('report downlod indicated')
  } catch (e) {
    console.log('report error')
    console.log(e)
    await csvDbRecord.indicateDownloadErrored(e)
    throw e
  }
  console.log('starting saturation')
  await csvDbRecord.indicateSaturationRunning()
  try {
    await Saturate[reportName]({ knex, source, csv_cid: csvDbRecord.cid, csv: csvDbRecord })
    console.log('saturation complete')
    await csvDbRecord.indicateSaturationCompleted()
  } catch (e) {
    await csvDbRecord.indicateSaturationErrored(e)
    throw e
  } finally {
    process.exit()
  }
}
