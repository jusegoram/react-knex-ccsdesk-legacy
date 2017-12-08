//CCS_UNIQUE MSE9ZJ5SSHC
import Promise from 'bluebird'
import { requiresAuth } from '../User/permissions'
import Tech from './sql'
import User from '../User/sql'

export default pubsub => ({
  Query: {
    techPage: requiresAuth.createResolver(async (obj, { limit, offset, sorts, filters }, context) => {
      const { user } = context
      const { techs, totalCount } = await Promise.props({
        totalCount: Tech.getTotalWithFilters({ user, filters }),
        techs: Tech.searchForWorkersWithText({ limit, offset, sorts, filters, user }),
      })

      return {
        totalCount,
        techs,
        offset,
        limit,
        hasNextPage: offset + limit < totalCount,
        hasPrevPage: offset > 0,
      }
    }),
    tech: requiresAuth.createResolver(async (obj, { cid }, context) => {
      return Tech.byId({ cid, user: context.user })
    }),
  },
  Mutation: {
    async findManagersForWorker(obj, { techId }) {
      return await Tech.findManagersForWorker(techId)
    },
    async claimTech(obj, { cid }, context) {
      const userId = context.user.id
      await User.addTechToTechsList({ cid, userId, pubsub })
      return Tech.byId({ cid, user: context.user })
    },
    async unclaimTech(obj, { cid }, context) {
      const userId = context.user.id
      await User.removeTechFromTechsList({ cid, userId, pubsub })
      return Tech.byId({ cid, user: context.user })
    },
  },
})
