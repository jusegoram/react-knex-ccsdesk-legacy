//CCS_UNIQUE F11J8BBGPV5
import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools'

import rootSchemaDef from './rootSchema.graphqls'
import modules from '../../modules/index.server'
import pubsub from './pubsub'
import log from '../../common/log'

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef].concat(modules.schemas),
  resolvers: modules.createResolvers(pubsub),
})

addErrorLoggingToSchema(executableSchema, { log: e => log.error(e) })

export default executableSchema
