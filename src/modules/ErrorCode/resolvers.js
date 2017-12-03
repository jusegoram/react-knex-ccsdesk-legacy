//CCS_UNIQUE U3W1DSF0VPH
const ErrorCode = require('./sql').default

export default () => ({
  Query: {
    async errorCodes() {
      return ErrorCode.getAllErrorCodes()
    },
  },
})
