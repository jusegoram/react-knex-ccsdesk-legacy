//CCS_UNIQUE 1VEUSG6E35F
import { graphqlExpress } from 'apollo-server-express'
import 'isomorphic-fetch'

import log from '../../common/log'
import schema from '../api/schema'
import modules from '../../modules/index.server'

export default graphqlExpress(async req => {
  try {
    return {
      schema,
      context: await modules.createContext(req),
    }
  } catch (e) {
    log(e.stack)
  }
})
