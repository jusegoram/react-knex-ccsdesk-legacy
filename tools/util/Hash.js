//CCS_UNIQUE 7AMT2EQSGC

const XXH = require('xxhashjs')

const H = XXH.h64(0)

const hash = plaintext => {
  const hsh = `h${H.update(plaintext)
  .digest()
  .toString(36)}`
  return hsh
}
module.exports = {
  string: hash,

  dbImport: ({ source, reportName, startedAt }) =>
    hash(`${source.toUpperCase()}_${reportName.toUpperCase()}_${startedAt}`),

  tech: ({ company, techId }) => hash(`Tech_${company.toUpperCase()}_${techId.toUpperCase()}`),

  group: ({ groupType, groupName }) => hash(`Group_${groupType.toUpperCase()}_${groupName.toUpperCase()}`),
}
