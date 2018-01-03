//CCS_UNIQUE S48THZF76G
const _ = require('lodash')

module.exports = async ({ knex, csv_cid }) => {
  const regions = _.keyBy(await knex.select().from('regions'), 'service_region')
  await knex.transaction(async trx => {
    return knex
    .select()
    .from('downloaded_csv_rows')
    .where({ csv_cid })
    .map(
      async row => {
        const status = row.data['BGO Activity Status']
        let techId = row.data['Tech ID']
        let techTeam = row.data['Tech Team']
        const date = row.data['BGO Snapshot Date']
        const activity_number = row.data['Activity ID']
        if (status === 'Scheduled' || status === 'Customer Unscheduled' || status === 'Unscheduled') {
          const activity = await knex
          .select(knex.raw('data->>\'Tech Team\' as "techTeam"'), knex.raw('data->>\'Tech User ID\' as "techId"'))
          .from('daily_activities')
          .where({
            date,
            activity_number,
          })
          .first()
          if (activity) {
            techId = activity.techId
            techTeam = activity.techTeam
          }
        }
        return {
          hsp: row.data['HSP Partner Name'],
          subcontractor:
              row.data['Subcontractor Company Name'] == 'UNKNOWN' ? null : row.data['Subcontractor Company Name'],
          dma: row.data['DMA'],
          office: row.data['Office'],
          service_region: row.data['Service Region'],
          division: (regions[row.data['Service Region']] && regions[row.data['Service Region']].division) || null,
          tech_team: techTeam,
          tech_id: techId,
          status: row.data['BGO Activity Status'] || null,
          type: row.data['Activity Type (Snapshot)'],
          subtype: row.data['Activity Sub Type (Snapshot)'],
          snapshot_date: date,
          numerator: row.data['# of Same Day Activity Closed Count'],
          denominator: row.data['# of Same Day Activity Scheduled Count'],
          dwelling_type: row.data['Dwelling Type'],
          activity_number,
        }
      },
      { concurrency: 100 }
    )
    .then(sdcr_rows => knex.batchInsert('sdcr', sdcr_rows, 1000).transacting(trx))
  })
}
