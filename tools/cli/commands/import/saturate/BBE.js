//CCS_UNIQUE S48THZF76G

module.exports = async ({ knex, csv_cid }) => {
  await knex.transaction(async trx => {
    await knex
    .select()
    .from('downloaded_csv_rows')
    .where({ csv_cid })
    .whereRaw(
      "(data_key, (data->>'Line #')::int) in " +
          "(SELECT data_key, max((data->>'Line #')::int) FROM downloaded_csv_rows where csv_cid = ? group by data_key)",
      [csv_cid]
    )
    .map(
      async row => {
        const activity_number = row.data_key
        const upsertObj = {
          activity_number,
          bbe_status: row.data['BBE Status'],
          bbe_category: row.data['OLI Category'],
        }
        const existing = await trx
        .select('activity_number')
        .from('bbe')
        .where({ activity_number })
        .first()
        if (existing) {
          await trx('bbe')
          .where({ activity_number })
          .update(upsertObj)
        } else {
          await trx('bbe').insert(upsertObj)
        }
      },
      { concurrency: 100 }
    )
  })
}
