//CCS_UNIQUE TMRIBDU679
const moment = require('moment')
const Hash = require('../../../util/Hash')

class CsvDbRecord {
  static async insertRowWithCurrentTime({ knex, source, reportName }) {
    const row = new CsvDbRecord()
    row.knex = knex
    row.source = source
    row.reportName = reportName

    const startedAt = moment()
    .startOf('minute')
    .valueOf()
    row.cid = Hash.dbImport({ source, reportName, startedAt })

    await row.knex.into('downloaded_csvs').insert({
      cid: row.cid,
      source: row.source,
      report_name: row.reportName,
    })
    return row
  }
  static async getInstanceById({ knex, source, reportName, cid }) {
    const row = new CsvDbRecord()
    row.knex = knex
    row.source = source
    row.reportName = reportName
    row.cid = cid
    return row
  }
  update(newAttrs) {
    return this.knex('downloaded_csvs')
    .where({ cid: this.cid })
    .update(newAttrs)
  }
  setHeaders(headers) {
    return this.update({ header_order: JSON.stringify(headers) })
  }
  indicateDownloadCompleted() {
    return this.update({
      downloaded_at: moment().format(),
      download_status: 'Complete',
    })
  }
  indicateDownloadErrored(e) {
    return this.update({
      error_at: moment().format(),
      download_status: 'Errored',
      saturate_status: 'Blocked',
      error: this.getErrorJson(e),
    })
  }
  indicateSaturationRunning() {
    return this.update({ saturate_status: 'Running' })
  }
  indicateSaturationCompleted() {
    return this.update({
      saturated_at: moment().format(),
      saturate_status: 'Complete',
    })
  }
  indicateSaturationErrored(e) {
    return this.update({
      error_at: moment().format(),
      saturate_status: 'Errored',
      error: this.getErrorJson(e),
    })
  }

  getErrorJson(e) {
    return {
      name: e.name,
      message: e.message,
      stack: e.stack,
    }
  }
}

module.exports = CsvDbRecord
