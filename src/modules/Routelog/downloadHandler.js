//CCS_UNIQUE R7KXTTQ5OB9
import { knex } from '../../database'

const csv = require('csv')
const Readable = require('stream').Readable

const columns = [
  'Activity Due Date',
  'Activity Due Date RT',
  'Planned Start Date RT',
  'Actual Start Date RT',
  'Actual End Date RT',
  'Planned Duration (FS Scheduler)',
  'Activity #',
  'Cust Acct Number',
  'SR',
  'DMA',
  'Status',
  'Reason Code',
  'Order Type',
  'Tech User ID',
  'Tech Full Name',
  'Tech Team',
  'Tech Type',
  'Team Name',
  'Cust Name',
  'House #',
  'Street Name',
  'City',
  'Zip',
  'Service County',
  'Service State',
  'Home Phone',
  'Cust Acct Number',
  'Created Date (with timestamp)',
  'Total Duration Minutes',
  '# of Negative Reschedules',
  'Activity Cancelled Date',
  'Activity Geo Longitude',
  'Activity Geo Latitude',
  'Dwelling Type',
  'Internet Connectivity',
  'BBE Status',
  'BBE OLI Category',
  'Timezone',
]

export default async (req, res) => {
  if (!req.user || (!req.user.hsp && !req.user.company)) return res.sendStatus(401)
  const date = req.params.id

  const { hsp, company } = req.user
  const results = await knex
  .select()
  .from('daily_activities')
  .where('date', date)
  .leftJoin('bbe', 'bbe.activity_number', 'daily_activities.activity_number')
  .where(function() {
    if (company !== hsp) {
      this.where({ company: company })
    } else {
      this.where({ source: hsp })
    }
  })

  const stream = new Readable({ objectMode: true })
  await results.map(row => {
    if (row.status == 'Rescheduled') row.data['Status'] = 'Rescheduled'
    if (row.bbe_status) row.data['BBE Status'] = row.bbe_status
    if (row.bbe_category) row.data['BBE OLI Category'] = row.bbe_category
    stream.push(row.data)
  })
  stream.push(null)

  res.setHeader('Content-disposition', 'attachment; filename=routelog.csv')
  res.setHeader('Content-type', 'text/csv')
  stream.pipe(csv.stringify({ columns, header: true })).pipe(res)
}
