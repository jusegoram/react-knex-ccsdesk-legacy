//CCS_UNIQUE 1G3DBTPXQI8
const RoutelogImport = require('./sql').default

export default () => ({
  Query: {
    async routelogDays(obj, params, context) {
      return RoutelogImport.getDaysForRoutelogImport({ user: context.user })
    },
    async routelogInfo(obj, params, context) {
      return RoutelogImport.getRoutelogByDate({ date: params.date, user: context.user })
    },
  },
})
