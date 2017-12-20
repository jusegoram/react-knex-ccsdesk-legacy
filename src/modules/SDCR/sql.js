//CCS_UNIQUE DI0N648N3E6
import { camelizeKeys } from 'humps'
import { knex } from '../../database'

const hspMap = {
  Goodman: 'MULTIBAND',
  DirectSat: 'DIRECT SAT',
}
export default class SdcrSql {
  static async getSdcrGroupedBy({ hsp, subcontractor, groupType, scopeType, scopeName }) {
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
      .groupBy(groupType)
      .orderBy('color', 'desc')
    )
  }
}
