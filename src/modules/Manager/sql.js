//CCS_UNIQUE NKSR0ZSQNK7
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
    this.whereRaw('email ~~* ?', [queryStringRegex])
    .orWhereRaw('first_name ~~* ?', [queryStringRegex])
    .orWhereRaw('last_name ~~* ?', [queryStringRegex])
  }
}

export default class OrgManager {
  static searchForManagersWithText({ limit, offset, queryString }) {
    return knex
    .select('*', knex.raw('COALESCE(akeys(parents), array[]::text[]) as parents'))
    .from('org_managers')
    .offset(offset)
    .where(getFilterWhereClause(queryString))
    .orderBy('email', 'asc')
    .limit(limit)
    .map(orgNode => {
      orgNode.parents = orgNode.parents || []
      return orgNode
    })
  }

  static getTotalWithTextFilter(queryString) {
    return knex('org_managers')
    .where(getFilterWhereClause(queryString))
    .count()
    .get(0)
    .get('count')
  }

  static getGroups(id) {
    return knex
    .raw('SELECT * from org_groups where id::text in (select skeys(parents) from org_managers where id = ?)', [id])
    .get('rows')
  }

  static byId(id) {
    return knex
    .select('*', knex.raw('COALESCE(akeys(parents), array[]::text[]) as parents'))
    .from('org_managers')
    .where({ id })
    .map(orgNode => {
      orgNode.parents = orgNode.parents || []
      return orgNode
    })
    .get(0)
  }
}
