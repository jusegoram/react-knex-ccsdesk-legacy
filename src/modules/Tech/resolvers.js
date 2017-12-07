//CCS_UNIQUE MSE9ZJ5SSHC
import Promise from 'bluebird'
import { requiresAuth } from '../User/permissions'
import Tech from './sql'
import User from '../User/sql'

export default pubsub => ({
  Query: {
    techs: requiresAuth.createResolver(async (obj, { limit, offset, queryString, myTechs }, context) => {
      const { user } = context
      const { techs, totalCount } = await Promise.props({
        totalCount: Tech.getTotalWithTextFilter({ user, myTechs, queryString }),
        techs: Tech.searchForWorkersWithText({ limit, offset, myTechs, queryString, user }),
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
      return await User.addTechToTechsList({ cid, userId, pubsub })
    },
    async unclaimTech(obj, { cid }, context) {
      const userId = context.user.id
      return await User.removeTechFromTechsList({ cid, userId, pubsub })
    },
  },
})
