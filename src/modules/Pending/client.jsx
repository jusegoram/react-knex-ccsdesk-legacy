//CCS_UNIQUE QK12Y7PH19
// React
import React from 'react'
import { NavLink } from 'react-router-dom'

// Web UI
import { NavItem } from 'reactstrap'

import { AuthRoute, AuthNav } from '../util/components/Auth'

// Component and helpers
import reducers from './reducers'
import PendingJobs from './pages/PendingJobs'

import Feature from '../ClientFeature'

export default new Feature({
  route: [<AuthRoute role="user" exact path="/pending-jobs" component={PendingJobs} />],
  navItem: (
    <NavItem>
      <NavLink to="/pending-jobs" className="nav-link" activeClassName="active">
        Pending Jobs
      </NavLink>
    </NavItem>
  ),
  reducer: { pendingJobs: reducers },
})
