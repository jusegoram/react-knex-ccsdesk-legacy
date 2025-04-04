//CCS_UNIQUE R5TNYMI34B
import chai from 'chai'
import chaiHttp from 'chai-http'

import { getOperationAST } from 'graphql'
import { createApolloFetch } from 'apollo-fetch'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { ApolloLink } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import WebSocket from 'ws'
import { LoggingLink } from 'apollo-logger'

import '../../../knexdata'
import { knex } from '../../database'
import settings from '../../../settings'

chai.use(chaiHttp)
chai.should()

let server
let apollo

before(async () => {
  await knex.migrate.latest()
  await knex.seed.run()

  server = require('../server').default

  const fetch = createApolloFetch({ uri: `http://localhost:${process.env['PORT']}/graphql` })
  const cache = new InMemoryCache({
    dataIdFromObject: o => o.cid || o.id,
  })
  let link = ApolloLink.split(
    operation => {
      const operationAST = getOperationAST(operation.query, operation.operationName)
      return !!operationAST && operationAST.operation === 'subscription'
    },
    new WebSocketLink({
      uri: `ws://localhost:${process.env['PORT']}/graphql`,
      webSocketImpl: WebSocket,
    }),
    new BatchHttpLink({ fetch })
  )

  apollo = new ApolloClient({
    link: ApolloLink.from((settings.app.logging.apolloLogging ? [new LoggingLink()] : []).concat([link])),
    cache,
  })
  apollo.resetStore()
})

after(() => {
  if (server) {
    server.close()
  }
})

export const getServer = () => server
export const getApollo = () => apollo
