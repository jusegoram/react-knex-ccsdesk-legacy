//CCS_UNIQUE MSE9ZJ5SSHC
const _ = require('lodash')
const Promise = require('bluebird')
const Tech = require('./sql').default
const User = require('../User/sql').default

export default pubsub => ({
  Query: {
    async techs(obj, { limit, offset, queryString, filter }, context) {
      const { user } = context
      const { techs, totalCount } = await Promise.props({
        totalCount: Tech.getTotalWithTextFilter({ user, filter, queryString }),
        techs: Tech.searchForWorkersWithText({ limit, offset, filter, queryString, user }),
      })

      return {
        totalCount,
        techs,
        offset,
        limit,
        hasNextPage: offset + limit < totalCount,
        hasPrevPage: offset > 0,
      }
    },
    async tech(obj, { cid }) {
      return Tech.byId(cid)
    },
  },
  Mutation: {
    async findManagersForWorker(obj, { techId }) {
      return await Tech.findManagersForWorker(techId)
    },
    async claimTech(obj, { cid }, context) {
      const userId = context.user.id
      return await User.addTechToTechsList({ cid, userId, pubsub })
    },
    async unclaimTech(obj, { cid }, context) {
      const userId = context.user.id
      return await User.removeTechFromTechsList({ cid, userId, pubsub })
    },
  },
})
