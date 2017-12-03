//CCS_UNIQUE 59G68U0JPIU
/*eslint-disable no-unused-vars*/
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'

export default pubsub => ({
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
})
