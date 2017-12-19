//CCS_UNIQUE DI0N648N3E6
import { map } from 'lodash'
import { camelizeKeys } from 'humps'
import { knex } from '../../database'

export default class SQL {
  static async getPendingJobsNear({ lat, lng, radius }) {
    const radiusInMeters = 1609.34 * radius
    console.log(lat, lng)
    const jobs = await knex
    .select()
    .from('pending_jobs')
    .whereRaw('ST_Distance(ST_Point(?, ?)::geography, location::geography) < ?', [lng, lat, radiusInMeters])
    return map(jobs, 'data')
  }
}
