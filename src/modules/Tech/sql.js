//CCS_UNIQUE V15D1NLSNUD
import _ from 'lodash'
import { camelizeKeys, decamelize } from 'humps'
import { DateTime } from 'luxon'
import { knex } from '../../database'

const getWhereFuncFromFilterForUser = user => filter => qb => {
  console.log(filter)
  if (filter.id == 'DMA' || filter.id == 'Office') {
    return qb.whereRaw('group_names->>? ~* ?', [filter.id, filter.value])
  } else if (filter.id == 'My Tech') {
    const myTechCids = knex
    .queryBuilder()
    .select(knex.raw('jsonb_array_elements_text(techs)'))
    .from('user')
    .where({ id: user.id })
    if (filter.value === 'true') return qb.whereIn('cid', myTechCids)
    else if (filter.value === 'false') return qb.whereNotIn('cid', myTechCids)
    else return
  } else {
    return qb.where(decamelize(filter.id), '~*', filter.value)
  }
}

const stringifyGroupNames = tech => {
  tech.group_names = JSON.stringify(tech.group_names)
  return tech
}

export default class Tech {
  static async searchForWorkersWithText({ user, limit, offset, sorts, filters }) {
    const companyFilter = !user.company
      ? {}
      : user.company === user.hsp ? { source: user.hsp } : { company: user.company }

    let query = knex
    .select()
    .from('techs')
    .where(companyFilter)
    .offset(offset)
    .limit(limit)

    const getWhereFuncFromFilter = getWhereFuncFromFilterForUser(user)

    filters.forEach(filter => {
      query = query.where(function() {
        getWhereFuncFromFilter(filter)(this)
      })
    })
    sorts.forEach(sort => {
      query = query.orderBy(decamelize(sort.id), sort.desc ? 'desc' : 'asc')
    })

    console.log(query.toString())
    return (await query).map(t => stringifyGroupNames(t)).map(t => camelizeKeys(t))
  }
  static async getTotalWithFilters({ user, filters }) {
    const companyFilter = !user.company
      ? {}
      : user.company === user.hsp ? { source: user.hsp } : { company: user.company }

    let query = knex
    .from('techs')
    .count()
    .where(companyFilter)

    const getWhereFuncFromFilter = getWhereFuncFromFilterForUser(user)
    filters.forEach(filter => {
      query = query.where(function() {
        getWhereFuncFromFilter(filter)(this)
      })
    })

    return await query.get(0).get('count')
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
