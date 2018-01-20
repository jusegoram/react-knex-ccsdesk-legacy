//CCS_UNIQUE R7KXTTQ5OB9
import { knex } from '../../database'

export default async (req, res) => {
  if (req.body.secret !== 'fd97c1438493e83cebf651ac6779250dd78b64c424b14fea548dc24c7e797f7d') return res.sendStatus(401)

  const { username, latitude, longitude, timestamp } = req.body
  knex('techs')
  .where({ tech_id: username })
  .update({
    location: knex.raw(`ST_Point(${parseFloat(longitude)}, ${parseFloat(latitude)})`),
    location_recorded_at: timestamp,
  })
  .then(() => {
    res.sendStatus(200)
  })
  .catch(e => {
    console.error(e)
    res.sendStatus(500)
  })
}
