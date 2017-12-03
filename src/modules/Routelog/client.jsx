//CCS_UNIQUE QK12Y7PH19
// React
import React from 'react'
import { NavLink } from 'react-router-dom'

// Web UI
import { NavItem } from 'reactstrap'

import { AuthRoute, AuthNav } from '../util/components/Auth'

// Component and helpers
import reducers from './reducers'
import RoutelogExplorer from './containers/RoutelogExplorer'

import Feature from '../ClientFeature'

export default new Feature({
  route: [<AuthRoute role="user" forClients={true} exact path="/routelogs" component={RoutelogExplorer} />],
  navItem: (
    <NavItem>
      <AuthNav role="user" forClients={true}>
        <NavLink to="/routelogs" className="nav-link" activeClassName="active">
          Routelog Explorer
        </NavLink>
      </AuthNav>
    </NavItem>
  ),
  reducer: { routelogs: reducers },
})
