//CCS_UNIQUE V15D1NLSNUD
import _ from 'lodash'
import { DateTime } from 'luxon'
import { knex } from '../../database'

const getFilterWhereClause = queryString => {
  if (!queryString) return () => {}
  const queryStringRegex =
    '%' +
    queryString
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_') +
    '%'
  return function() {
    this.whereRaw('tech_id ~~* ?', [queryStringRegex])
    .orWhereRaw('first_name ~~* ?', [queryStringRegex])
    .orWhereRaw('last_name ~~* ?', [queryStringRegex])
  }
}

const stringifyGroupNames = tech => {
  tech.group_names = JSON.stringify(tech.group_names)
  return tech
}

export default class Tech {
  static searchForWorkersWithText({ user, filter, limit, offset, queryString }) {
    const companyFilter = !user.company
      ? {}
      : user.company === user.hsp ? { source: user.hsp } : { company: user.company }
    return (
      knex
      .select()
      .from('techs')
      .offset(offset)
      .where(getFilterWhereClause(queryString))
      .where(companyFilter)
      .where(function() {
        return !filter ? {} : this.whereIn('cid', filter)
      })
      .orderBy('tech_id', 'asc')
      .limit(limit)
    // .map(camelizeKeys)
      .map(stringifyGroupNames)
    )
  }

  static getTotalWithTextFilter({ user, filter, queryString }) {
    const companyFilter = !user.company
      ? {}
      : user.company === user.hsp ? { source: user.hsp } : { company: user.company }
    return knex('techs')
    .where(getFilterWhereClause(queryString))
    .where(companyFilter)
    .where(function() {
      return !filter ? {} : this.whereIn('cid', filter)
    })
    .count()
    .get(0)
    .get('count')
  }

  static byId(cid) {
    return knex
    .select()
    .from('techs')
    .where({ cid })
    .first()
    .then(stringifyGroupNames)
  }

  static async getTechJobs(techId) {
    const { employee_id } = await knex
    .select('employee_id')
    .from('org_workers')
    .where({ id: techId })
    .first()
    return knex
    .select()
    .from('daily_activities')
    .whereRaw('data @> ?::jsonb', [JSON.stringify({ 'Tech User ID': employee_id })])
    .where(
      'date',
      DateTime.local()
      .setZone('America/Chicago')
      .toISODate()
    )
    .map(row => ({
      data: JSON.stringify(row.data),
    }))
  }

  /* TEMP */
  static getGroups(id) {
    return knex
    .raw(
      'SELECT org_groups.id, org_groups.type, org_groups.name from org_workers' +
          ' left join org_groups on org_workers.parents \\? org_groups.id::text where org_workers.id = ?',
      [id]
    )
    .get('rows')
  }
  static async findManagersForWorker(techId) {
    const workerId = await knex
    .select('id')
    .from('org_workers')
    .where({ employee_id: techId })
    .first()
    .get('id')
    const groups = await Tech.getGroups(workerId)
    const groupIds = _.map(groups, 'id')
    const arrayLiteral = '{' + groupIds.join(',') + '}'
    const results = await knex
    .raw('select *, COALESCE(akeys(parents), array[]::text[]) as parents from org_managers where parents \\?| ?', [
      arrayLiteral,
    ])
    .get('rows')
    .map(result => {
      result.techGroups = groups
      return JSON.stringify(result)
    })
    return results
  }
  /* END TEMP */
}
