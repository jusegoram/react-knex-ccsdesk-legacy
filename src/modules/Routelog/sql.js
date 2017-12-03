//CCS_UNIQUE DI0N648N3E6
import moment from 'moment'
import _ from 'lodash'
import { knex } from '../../database'

export default class RoutelogImport {
  static async getDaysForRoutelogImport({ user }) {
    if (!user || (!user.hsp && !user.company)) {
      throw new Error('Unauthorized')
    }
    const importDays = await knex
    .select()
    .distinct('date')
    .from('daily_activities')
    .where(function() {
      if (user.company !== user.hsp) {
        this.where({ company: user.company })
      } else {
        this.where({ source: user.hsp })
      }
    })
    .orderBy('date', 'desc')
    .map(result => {
      result.date = moment(result.date).format('YYYY-MM-DD')
      return result
    })
    return importDays
  }
  static async getRoutelogByDate({ date, user }) {
    if (!user || (!user.hsp && !user.company)) {
      throw new Error('Unauthorized')
    }
    const routelogInfo = await knex
    .select('status', knex.raw('count(*)'))
    .from('daily_activities')
    .whereRaw('due_date = date')
    .where('date', date)
    .where(function() {
      if (user.company !== user.hsp) {
        this.where({ company: user.company })
      } else {
        this.where({ source: user.hsp })
      }
    })
    .groupBy('status')
    .orderBy('count', 'desc')
    .map(result => {
      result.date = moment(result.date).format('YYYY-MM-DD')
      return result
    })
    .then(results => {
      const stats = JSON.stringify(_.mapValues(_.keyBy(results, 'status'), stat => stat.count))
      return {
        date,
        stats,
      }
    })
    return routelogInfo
  }
}
