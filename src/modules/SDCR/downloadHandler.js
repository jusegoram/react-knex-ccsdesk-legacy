//CCS_UNIQUE R7KXTTQ5OB9
import { knex } from '../../database'
import Sql from './sql'

const csv = require('csv')
const Readable = require('stream').Readable

export default async (req, res) => {
  if (!req.user || (!req.user.hsp && !req.user.company)) return res.sendStatus(401)
  const { hsp, company } = req.user
  const { dwelling, startDate, endDate, groupType, scopeType, scopeName, type } = req.query

  const companyType = hsp === company ? 'hsp' : 'subcontractor'
  const data = await Sql.getSdcrRawData({
    [companyType]: company,
    groupType,
    scopeType,
    dwelling,
    type,
    scopeName,
    startDate,
    endDate,
  })

  const stream = new Readable({ objectMode: true })

  data.forEach(row => {
    stream.push(row)
  })
  stream.push(null)

  res.setHeader('Content-disposition', 'attachment; filename=sdcr.csv')
  res.setHeader('Content-type', 'text/csv')
  stream.pipe(csv.stringify({ header: true })).pipe(res)
}
