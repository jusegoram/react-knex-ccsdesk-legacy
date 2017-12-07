//CCS_UNIQUE V15D1NLSNUD
import _ from 'lodash'
import { camelizeKeys } from 'humps'
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
  static async searchForWorkersWithText({ user, myTechs, limit, offset, queryString }) {
    const companyFilter = !user.company
      ? {}
      : user.company === user.hsp ? { source: user.hsp } : { company: user.company }
    const techs = await knex
    .select('techs')
    .from('user')
    .where({ id: user.id })
    .first()
    .get('techs')

    const results = knex
    .select()
    .from('techs')
    .offset(offset)
    .where(getFilterWhereClause(queryString))
    .where(companyFilter)
    .where(function() {
      return !myTechs ? {} : this.whereIn('cid', techs)
    })
    .orderBy('tech_id', 'asc')
    .limit(limit)

    return (await results).map(t => stringifyGroupNames(t)).map(t => camelizeKeys(t))
  }
  static async getTotalWithTextFilter({ user, myTechs, queryString }) {
    const companyFilter = !user.company
      ? {}
      : user.company === user.hsp ? { source: user.hsp } : { company: user.company }
    const techs = await knex
    .select('techs')
    .from('user')
    .where({ id: user.id })
    .first()
    .get('techs')
    return knex('techs')
    .where(getFilterWhereClause(queryString))
    .where(companyFilter)
    .where(function() {
      return !myTechs ? {} : this.whereIn('cid', techs)
    })
    .count()
    .get(0)
    .get('count')
  }

  static async byId({ cid, user }) {
    const tech = camelizeKeys(
      await knex
      .select()
      .from('techs')
      .where({ cid })
      .first()
      .then(stringifyGroupNames)
    )
    const contacts = camelizeKeys(
      await knex
      .select('id', 'first_name', 'last_name', 'role', 'phone_number')
      .from('user')
      .where(() => {
        return !user.company ? {} : { company: user.company }
      })
      .whereRaw('techs @> ?', [JSON.stringify(cid)])
    )
    tech.contacts = contacts
    return tech
  }

  static async getContacts({ cid, user }) {
    return camelizeKeys(
      await knex
      .select('id', 'first_name', 'last_name', 'role', 'phone_number')
      .from('user')
      .where(() => {
        return !user.company ? {} : { company: user.company }
      })
      .whereRaw('techs @> ?', [JSON.stringify(cid)])
    )
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
