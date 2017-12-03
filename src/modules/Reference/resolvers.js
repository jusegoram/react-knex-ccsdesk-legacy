//CCS_UNIQUE VW2V14DGMK
const Reference = require('./sql').default

export default () => ({
  Query: {
    async referenceEnums() {
      return Reference.getAllEnums()
    },
  },
})
