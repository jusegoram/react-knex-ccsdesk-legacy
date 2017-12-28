//CCS_UNIQUE DI0N648N3E6
import { camelizeKeys } from 'humps'
import moment from 'moment'
import { knex } from '../../database'

const hspMap = {
  Goodman: 'MULTIBAND',
  DirectSat: 'DIRECT SAT',
}
export default class SdcrSql {
  static async getSdcrGroupedBy({ hsp, subcontractor, groupType, scopeType, scopeName, startDate, endDate }) {
    const companyFilter = hsp ? { hsp: hspMap[hsp] } : { subcontractor }
    const scopeFilter = scopeType && scopeName ? { [scopeType]: scopeName } : {}
    return camelizeKeys(
      await knex
      .select(
        knex.raw('?? as name', [groupType]),
        knex.raw('(1.0*sum(numerator))/sum(denominator) as color'),
        knex.raw('sum(denominator) as size')
      )
      .from('sdcr')
      .where(companyFilter)
      .where(scopeFilter)
      .where('snapshot_date', '>=', startDate)
      .where('snapshot_date', '<=', endDate)
      .groupBy(groupType)
      .orderBy('color', 'desc')
    )
  }
}

// const correctedTechs = await knex
// .select(knex.raw("data->>'Activity ID' as activity_number"), knex.raw("data->>'BGO Snapshot Date' as date"))
// .from('downloaded_csv_rows')
// .whereRaw("data->>'BGO Activity Status' IN ('Scheduled', 'Unscheduled', 'Customer Unscheduled')")
// .where({ csv_cid })
// .map(badTechJob => {
//   return knex
//   .select(
//     'activity_number',
//     'date',
//     knex.raw("data->>'Tech User ID' as tech_id"),
//     knex.raw("data->>'Tech Team' as tech_team")
//   )
//   .from('daily_activities')
//   .where(badTechJob)
//   .first()
// })
