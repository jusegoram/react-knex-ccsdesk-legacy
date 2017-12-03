//CCS_UNIQUE WGYKC87DKDQ
// Components
import schema from './schema.graphqls'
import createResolvers from './resolvers'
import Feature from '../ServerFeature'

export default new Feature({ schema, createResolversFunc: createResolvers })
