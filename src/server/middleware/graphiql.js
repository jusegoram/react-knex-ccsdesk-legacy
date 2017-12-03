//CCS_UNIQUE AR1VMEYKMY
import { graphiqlExpress } from 'apollo-server-express'
import url from 'url'

export default graphiqlExpress(() => {
  try {
    const subscriptionsUrl = (__DEV__ ? 'http://localhost:8080/graphql' : 'https://ccsdesk.com/graphql').replace(
      /^http/,
      'ws'
    )

    return {
      endpointURL: '/graphql',
      subscriptionsEndpoint: subscriptionsUrl,
      query: '{\n' + '  counter {\n' + '    amount\n' + '  }\n' + '}',
    }
  } catch (e) {
    console.error(e.stack)
  }
})
