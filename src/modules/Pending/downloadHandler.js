//CCS_UNIQUE R7KXTTQ5OB9
import { knex } from '../../database'

const csv = require('csv')
const Readable = require('stream').Readable

export default async (req, res) => {
  if (!req.user || (!req.user.hsp && !req.user.company)) return res.sendStatus(401)
  const { hsp, company } = req.user

  let hsps = null
  if (hsp) {
    if (hsp == company) {
      hsps = [hsp]
    } else {
      hsps = knex
      .distinct('source')
      .from('techs')
      .where({ company })
    }
  } else {
    hsps = knex.distinct('source').from('techs')
  }
  const stream = new Readable({ objectMode: true })
  const jobs = await knex
  .select('source', 'data')
  .from('pending_jobs')
  .whereIn('source', hsps)
  jobs.forEach(row => {
    row.data.hsp = row.source
    stream.push(row.data)
  })
  stream.push(null)

  res.setHeader('Content-disposition', 'attachment; filename=routelog.csv')
  res.setHeader('Content-type', 'text/csv')
  stream.pipe(csv.stringify({ header: true })).pipe(res)
}
