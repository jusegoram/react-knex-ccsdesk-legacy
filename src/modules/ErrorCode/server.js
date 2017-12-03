//CCS_UNIQUE ATMZ1SBMBNG
import schema from './schema.graphqls'
import createResolvers from './resolvers'

import Feature from '../ServerFeature'

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {},
})
