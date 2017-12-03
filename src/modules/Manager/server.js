//CCS_UNIQUE 8SWN62M0EG
import schema from './schema.graphqls'
import createResolvers from './resolvers'

import Feature from '../ServerFeature'

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {},
})
