//CCS_UNIQUE 5M5LAN8OU5
// React
import React from 'react'
import { NavLink } from 'react-router-dom'

// Web UI
import { NavItem } from 'reactstrap'

import { AuthRoute, AuthNav } from '../util/components/Auth'

// Component and helpers
import reducers from './reducers'
import Reference from './containers/Reference'

import Feature from '../ClientFeature'

export default new Feature({
  route: [<AuthRoute role="user" exact path="/reference" component={Reference} />],
  navItem: (
    <NavItem>
      <AuthNav role="user">
        <NavLink to="/reference" className="nav-link" activeClassName="active">
          References
        </NavLink>
      </AuthNav>
    </NavItem>
  ),
  reducer: { reference: reducers },
})
