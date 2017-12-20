//CCS_UNIQUE 1G3DBTPXQI8
import Sql from './sql'
import { requiresAuth } from '../User/permissions'
import Hash from '../../../tools/util/Hash'

export default () => ({
  Query: {
    sdcr: requiresAuth.createResolver(async (obj, params, context) => {
      const { user: { hsp: userHsp, company } } = context
      const { scopeType, scopeName, groupType, startDate, endDate } = params
      const companyType = userHsp === company ? 'hsp' : 'subcontractor'
      const data = (await Sql.getSdcrGroupedBy({
        [companyType]: company,
        groupType,
        scopeType,
        scopeName,
        startDate,
        endDate,
      })).map(datum => ({
        cid: Hash.group({ groupType, groupName: datum.name }),
        ...datum,
      }))
      return {
        scopeType,
        scopeName,
        groupType,
        data,
      }
    }),
  },
})
