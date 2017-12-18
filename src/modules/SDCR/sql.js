//CCS_UNIQUE DI0N648N3E6
import { camelizeKeys } from 'humps'
import { knex } from '../../database'

const hspMap = {
  Goodman: 'MULTIBAND',
  DirectSat: 'DIRECT SAT',
}
export default class SdcrSql {
  static async getSdcrGroupedBy({ hsp, subcontractor, groupType }) {
    const companyFilter = hsp ? { hsp: hspMap[hsp] } : { subcontractor }
    return camelizeKeys(
      await knex
      .select(
        knex.raw('dma as group_name'),
        knex.raw('sum(numerator) as numerator'),
        knex.raw('sum(denominator) as denominator'),
        knex.raw('(100.0*sum(numerator))/sum(denominator) as percentage')
      )
      .from('sdcr')
      .where(companyFilter)
      .groupBy(groupType)
    )
  }
}
