//CCS_UNIQUE S48THZF76G
const _ = require('lodash')
const moment = require('moment')

const sourceMap = {
  Goodman: 'MULTIBAND',
  DirectSat: 'DIRECT SAT',
}

module.exports = async ({ knex, csv_cid, csv }) => {
  const regions = _.keyBy(await knex.select().from('regions'), 'service_region')
  await knex.transaction(async trx => {
    await trx('sdcr')
    .where(
      'snapshot_date',
      '>=',
      moment()
      .add(-2, 'days')
      .startOf('month')
      .format('YYYY-MM-DD')
    )
    .where('imported_on', '<>', moment().format('YYYY-MM-DD'))
    .where({ hsp: sourceMap[csv.source] })
    .delete()
    return knex
    .select()
    .from('downloaded_csv_rows')
    .where({ csv_cid })
    .map(
      async row => {
        const status = row.data['Activity Status (Snapshot)']
        let techId = row.data['Tech ID']
        let techTeam = row.data['Tech Team']
        let subcontractor =
            row.data['Subcontractor Company Name'] == 'UNKNOWN' ? null : row.data['Subcontractor Company Name']
        const date = row.data['BGO Snapshot Date']
        const activity_number = row.data['Activity ID']
        if (status !== 'Closed' && status !== 'Pending Closed') {
          const activity = await knex
          .select(
            knex.raw('data->>\'Tech Team\' as "techTeam"'),
            knex.raw('data->>\'Tech User ID\' as "techId"'),
            knex.raw('data->>\'Tech Type\' as "subcontractor"')
          )
          .from('downloaded_csv_rows')
          .leftJoin('downloaded_csvs', 'csv_cid', 'cid')
          .where({ report_name: 'Routelog' })
          .whereRaw('"started_at"::Date = ?', [date])
          .whereRaw("left(data->>'Activity Due Date', 10)::Date = ?", [date])
          .whereRaw("data->>'Tech User ID' <> 'UNKNOWN'")
          .where({ data_key: activity_number })
          .orderBy('started_at', 'desc')
          .first()
          if (activity) {
            techId = activity.techId
            techTeam = activity.techTeam
            subcontractor = activity.subcontractor == 'W2' ? null : activity.subcontractor
          }
        }
        return {
          hsp: row.data['HSP Partner Name'],
          subcontractor,
          dma: row.data['DMA'],
          office: row.data['Office'],
          service_region: row.data['Service Region'],
          division: (regions[row.data['Service Region']] && regions[row.data['Service Region']].division) || null,
          tech_team: techTeam,
          tech_id: techId,
          status: status || null,
          type: row.data['Activity Type (Snapshot)'],
          subtype: row.data['Activity Sub Type (Snapshot)'],
          snapshot_date: date,
          numerator: row.data['# of Same Day Activity Closed Count'],
          denominator: row.data['# of Same Day Activity Scheduled Count'],
          dwelling_type: row.data['Dwelling Type'],
          activity_number,
        }
      },
      { concurrency: 50 }
    )
    .then(sdcr_rows => knex.batchInsert('sdcr', sdcr_rows, 1000).transacting(trx))
    .then(async () => {
      await trx('sdcr')
      .where('snapshot_date', '=', '2018-01-17')
      .delete()
    })
  })
}
