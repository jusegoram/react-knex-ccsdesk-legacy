//CCS_UNIQUE DI0N648N3E6
import { camelizeKeys } from 'humps'
import moment from 'moment'
import { knex } from '../../database'

const d3 = require('d3')

let badColor_prod,
  badColor_service,
  colorMap_prod,
  colorMap_service,
  goodColor_prod,
  goodColor_service,
  neutralColor_prod,
  neutralColor_service

badColor_prod = d3
.scaleLinear()
.domain([0, 48, 68])
.range(['#ff0000', '#ff0000', '#660000'])

// dark blue -> light blue
neutralColor_prod = d3
.scaleLinear()
.domain([68, 75])
.range(['#cc6500', '#ffd400'])

// dark green -> light green
goodColor_prod = d3
.scaleLinear()
.domain([75, 85, 100])
.range(['#408000', '#0c22a6', '#0c22a6'])

colorMap_prod = function(d) {
  if (!d) {
    return '#ccc'
  } else if (d.value < 68) {
    return badColor_prod(d.value)
  } else if (d.value < 75) {
    return neutralColor_prod(d.value)
  } else {
    return goodColor_prod(d.value)
  }
}

badColor_service = d3
.scaleLinear()
.domain([0, 69, 79])
.range(['#ff0000', '#ff0000', '#660000'])

// dark blue -> light blue
neutralColor_service = d3
.scaleLinear()
.domain([79, 82])
.range(['#cc6500', '#ffd400'])

// dark green -> light green
goodColor_service = d3
.scaleLinear()
.domain([82, 92, 100])
.range(['#408000', '#0c22a6', '#0c22a6'])

colorMap_service = function(d) {
  if (!d) {
    return '#ccc'
  } else if (d.value < 79) {
    return badColor_service(d.value)
  } else if (d.value < 82) {
    return neutralColor_service(d.value)
  } else {
    return goodColor_service(d.value)
  }
}

const hspMap = {
  Goodman: 'MULTIBAND',
  DirectSat: 'DIRECT SAT',
}

export default class SdcrSql {
  static async getSdcrGroupedBy({
    hsp,
    subcontractor,
    groupType,
    dwelling,
    type,
    scopeType,
    scopeName,
    startDate,
    endDate,
  }) {
    const companyFilter = hsp ? { hsp: hspMap[hsp] } : { subcontractor }
    const scopeFilter = scopeType && scopeName ? { [scopeType]: scopeName } : {}
    const results = (await knex
    .select(
      knex.raw('?? as name', [groupType]),
      knex.raw('sum(denominator) as size'),
      knex.raw('(100.0*sum(numerator))/sum(denominator) as value')
    )
    .from('sdcr')
    .where(companyFilter)
    .where(scopeFilter)
    .where(type ? { type } : {})
    .where(dwelling ? { dwelling_type: dwelling } : {})
    .where('snapshot_date', '>=', startDate)
    .where('snapshot_date', '<=', endDate)
    .groupBy(groupType)
    .orderBy('value', 'desc')).map(row => ({
      ...row,
      color: type == 'SDCR_Repairs' ? colorMap_service(row) : colorMap_prod(row),
    }))

    return camelizeKeys(results)
  }
  static async getSdcrRawData({
    hsp,
    subcontractor,
    groupType,
    dwelling,
    type,
    scopeType,
    scopeName,
    startDate,
    endDate,
  }) {
    const companyFilter = hsp ? { hsp: hspMap[hsp] } : { subcontractor }
    const scopeFilter = scopeType && scopeName ? { [scopeType]: scopeName } : {}
    console.log(startDate)
    console.log(endDate)
    const results = await knex
    .select()
    .from('sdcr')
    .where(companyFilter)
    .where(scopeFilter)
    .where(type ? { type } : {})
    .where(dwelling ? { dwelling_type: dwelling } : {})
    .where('snapshot_date', '>=', startDate)
    .where('snapshot_date', '<=', endDate)

    return camelizeKeys(results)
  }
  static async getAllSdcrRawData({ hsp, subcontractor, startDate, endDate }) {
    const companyFilter = hsp ? { hsp: hspMap[hsp] } : { subcontractor }
    const query = knex
    .select([
      knex.raw('sdcr.hsp as "HSP"'),
      knex.raw('sdcr.division as "Division"'),
      knex.raw('sdcr.dma as "DMA"'),
      knex.raw('sdcr.office as "Office"'),
      knex.raw('sdcr.service_region as "Service Region"'),
      knex.raw('to_char(sdcr.snapshot_date, \'MM/DD/YY\') as "Snapshot Date"'),
      knex.raw('sdcr.activity_number as "Activity Number"'),
      knex.raw('sdcr.type as "Type"'),
      knex.raw('sdcr.subtype as "Subtype"'),
      knex.raw('sdcr.tech_id as "Tech ID"'),
      knex.raw('(techs.last_name || \' \' || techs.first_name) as "Tech Name"'),
      knex.raw('sdcr.tech_team as "Tech Team"'),
      knex.raw('sdcr.subcontractor as "Subcontractor"'),
      knex.raw('sdcr.status as "EOD Status"'),
      knex.raw('sdcr.numerator as "Numerator"'),
      knex.raw('sdcr.denominator as "Denominator"'),
      knex.raw('sdcr.dwelling_type as "Dwelling Type"'),
    ])
    .from('sdcr')
    .leftJoin('techs', 'sdcr.tech_id', 'techs.tech_id')
    .where(companyFilter)
    .where('snapshot_date', '>=', startDate)
    .where('snapshot_date', '<=', endDate)

    const results = await query

    return results
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
