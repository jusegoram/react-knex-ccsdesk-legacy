//CCS_UNIQUE DI0N648N3E6
import { map } from 'lodash'
import { camelizeKeys } from 'humps'
import { knex } from '../../database'

export default class SQL {
  static async getPendingJobsNear({ hsp, lat, lng, radius }) {
    const radiusInMeters = 1609.34 * radius
    const hspFilter = hsp ? { source: hsp } : {}
    const jobs = await knex
    .select('*', knex.raw('ST_Distance(ST_Point(?, ?)::geography, location::geography) as distance', [lng, lat]))
    .from('pending_jobs')
    .where(hspFilter)
    .whereRaw('ST_Distance(ST_Point(?, ?)::geography, location::geography) < ?', [lng, lat, radiusInMeters])
    .orderBy(knex.raw('ST_Distance(ST_Point(?, ?)::geography, location::geography)', [lng, lat]))
    jobs.forEach(row => {
      row.data.distance = row.distance
      row.data.hsp = row.source
    })
    return map(jobs, 'data')
  }
}
