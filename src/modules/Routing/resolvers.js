//CCS_UNIQUE 1G3DBTPXQI8

// import Sql from './sql'
import axios from 'axios'
import Promise from 'bluebird'
import { requiresAuth } from '../User/permissions'
import { knex } from '../../database'

export default () => ({
  Query: {
    routing: requiresAuth.createResolver(async (obj, params, context) => {
      if (!/.-.{8}/.test(params.activityNumber)) return []
      const activityNumber = encodeURIComponent(params.activityNumber)
      try {
        const result = await axios.get(
          `https://goodman.fstechsupport.com/api/user/forJob?activityNumber=${activityNumber}`
        )
        const result2 = await Promise.resolve(result.data).map(async tech => {
          console.log(tech)
          const cidObj = await knex
          .select('cid')
          .from('techs')
          .where({ tech_id: tech.techId })
          .first()
          tech.cid = cidObj && cidObj.cid
          return tech
        })
        return result2
      } catch (e) {
        console.error(e)
        return []
      }
    }),
  },
})
