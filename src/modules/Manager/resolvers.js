//CCS_UNIQUE 0L1I2M82LOM
const _ = require('lodash')
const Promise = require('bluebird')
const OrgManager = require('./sql').default

export default () => ({
  Query: {
    async managerPage(obj, { limit, offset, queryString }) {
      const { managers, totalCount } = await Promise.props({
        totalCount: OrgManager.getTotalWithTextFilter(queryString),
        managers: OrgManager.searchForManagersWithText({ limit, offset, queryString }),
      })

      return {
        totalCount,
        managers,
        offset,
        limit,
        hasNextPage: offset + limit < totalCount,
        hasPrevPage: offset > 0,
      }
    },
    async managerGroups(obj, { id }) {
      const groups = await OrgManager.getGroups(id)
      const groupRankings = {
        COMPANY: 0,
        SUBCONTRACTOR: 1,
        DMA: 2,
        OFFICE: 3,
        SERVICE_REGION: 4,
        TECH_TEAM: 5,
      }
      return _.sortBy(groups, group => groupRankings[group.type])
    },
    manager(obj, { id }) {
      return OrgManager.byId(id)
    },
  },
})
