//CCS_UNIQUE DI0N648N3E6
import { map } from 'lodash'
import { camelizeKeys } from 'humps'
import { knex } from '../../database'

export default class SQL {
  static async getPendingJobsNear({ hsp, company, lat, lng, radius }) {
    const radiusInMeters = 1609.34 * radius
    let hsps = null
    if (hsp) {
      if (hsp == company) {
        hsps = [hsp]
      } else {
        hsps = knex
        .distinct('source')
        .from('techs')
        .where({ company })
      }
    } else {
      hsps = knex.distinct('source').from('techs')
    }
    const jobs = await knex
    .select('*', knex.raw('ST_Distance(ST_Point(?, ?)::geography, location::geography) as distance', [lng, lat]))
    .from('pending_jobs')
    .whereIn('source', hsps)
    .whereRaw('ST_Distance(ST_Point(?, ?)::geography, location::geography) < ?', [lng, lat, radiusInMeters])
    .orderBy(knex.raw('ST_Distance(ST_Point(?, ?)::geography, location::geography)', [lng, lat]))
    jobs.forEach(row => {
      row.data.distance = row.distance
      row.data.hsp = row.source
    })
    return map(jobs, 'data')
  }
}
