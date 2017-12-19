//CCS_UNIQUE 1G3DBTPXQI8
import moment from 'moment'
import axios from 'axios'
import { requiresAuth } from '../User/permissions'
import Sql from './sql'

const API_KEY = 'AIzaSyDUba12IwODm3q0gIBJ7ABxGhINXVRsFfo'

export default () => ({
  Query: {
    pendingJobs: requiresAuth.createResolver(async (obj, params, context) => {
      if (context.user.hsp || context.user.company) throw new Error('Unauthorized')
      const { address, radius } = params
      const encodedAddress = encodeURIComponent(address)
      const result = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${API_KEY}`
      )
      if (result.status !== 200) {
        return []
      }
      const { lat, lng } = result.data.results[0].geometry.location
      const jobs = await Sql.getPendingJobsNear({ lat, lng, radius })
      const mappedJobs = jobs.map(job => ({
        activityNumber: job['Activity Number'],
        status: job['Activity Status'],
        dueDate: job['Activity Due Date RT'] && moment.utc(job['Activity Due Date RT']).format(),
        address: job['Service Addr #'],
        distance: job.distance,
        hsp: job.hsp,
      }))
      return mappedJobs
    }),
  },
})
