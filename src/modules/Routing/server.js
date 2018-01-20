//CCS_UNIQUE JFI0NS4UWH9
import schema from './schema.graphqls'
import createResolvers from './resolvers'

import Feature from '../ServerFeature'

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {},
})
