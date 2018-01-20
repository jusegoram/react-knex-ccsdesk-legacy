//CCS_UNIQUE 1G3DBTPXQI8

// import Sql from './sql'
import axios from 'axios'
import { requiresAuth } from '../User/permissions'

export default () => ({
  Query: {
    routing: requiresAuth.createResolver(async (obj, params, context) => {
      if (!/.-.{8}/.test(params.activityNumber)) return []
      const activityNumber = encodeURIComponent(params.activityNumber)
      try {
        const result = await axios.get(
          `https://goodman.fstechsupport.com/api/user/forJob?activityNumber=${activityNumber}`
        )
        return result.data
      } catch (e) {
        return []
      }
    }),
  },
})
