//CCS_UNIQUE WT3FCKH60MB
import schema from './schema.graphqls'
import createResolvers from './resolvers'

import Feature from '../ServerFeature'

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {},
})
