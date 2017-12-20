//CCS_UNIQUE S48THZF76G
module.exports = async ({ knex, csv_cid }) => {
  await knex.transaction(async trx => {
    return knex
    .select()
    .from('downloaded_csv_rows')
    .where({ csv_cid })
    .map(row => ({
      hsp: row.data['HSP Partner Name'],
      subcontractor:
          row.data['Subcontractor Company Name'] == 'UNKNOWN' ? null : row.data['Subcontractor Company Name'],
      dma: row.data['DMA'],
      office: row.data['Office'],
      service_region: row.data['Service Region'],
      tech_team: row.data['Tech Team'],
      tech_id: row.data['Tech ID'],
      status: row.data['BGO Activity Status'] || null,
      type: row.data['Activity Type (Snapshot)'],
      subtype: row.data['Activity Sub Type (Snapshot)'],
      snapshot_date: row.data['BGO Snapshot Date'],
      numerator: row.data['# of Same Day Activity Closed Count'],
      denominator: row.data['# of Same Day Activity Scheduled Count'],
    }))
    .then(sdcr_rows => knex.batchInsert('sdcr', sdcr_rows, 1000).transacting(trx))
  })
}
