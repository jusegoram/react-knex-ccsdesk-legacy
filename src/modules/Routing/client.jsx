//CCS_UNIQUE QK12Y7PH19
// React
import React from 'react'
import { NavLink } from 'react-router-dom'

// Web UI
import { NavItem } from 'reactstrap'

import { AuthRoute, AuthNav } from '../util/components/Auth'

// Component and helpers
import reducers from './reducers'
import SdcrExplorer from './pages/SdcrExplorer'

import Feature from '../ClientFeature'

export default new Feature({
  route: [<AuthRoute role="user" exact path="/routing" component={SdcrExplorer} />],
  navItem: (
    <NavItem>
      <AuthNav role="user">
        <NavLink to="/routing" className="nav-link" activeClassName="active">
          Routing
        </NavLink>
      </AuthNav>
    </NavItem>
  ),
  reducer: { routing: reducers },
})
