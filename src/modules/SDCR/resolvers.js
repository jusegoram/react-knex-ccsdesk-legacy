//CCS_UNIQUE 1G3DBTPXQI8
import _ from 'lodash'

import Sql from './sql'
import { requiresAuth } from '../User/permissions'

export default () => ({
  Query: {
    sdcr: requiresAuth.createResolver((obj, params, context) => {
      const { user: { hsp: userHsp, company } } = context
      const { scopeType, scopeName, groupType } = params.params
      const companyType = userHsp === company ? 'hsp' : 'subcontractor'
      const data = Sql.getSdcrGroupedBy({
        [companyType]: company,
        groupType,
      })
      return {
        scopeType,
        scopeName,
        groupType,
        data,
      }
    }),
  },
})
