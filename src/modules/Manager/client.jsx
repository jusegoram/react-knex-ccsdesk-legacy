//CCS_UNIQUE UA1FXRT5Q5C
// React
import React from 'react'
import { NavLink } from 'react-router-dom'

// Web UI
import { NavItem } from 'reactstrap'

import { AuthRoute, AuthNav } from '../util/components/Auth'

// Component and helpers
import Managers from './pages/Managers'
import reducers from './reducers'

import Feature from '../ClientFeature'

export default new Feature({
  route: [<AuthRoute role="user" exact path="/managers" component={Managers} />],
  navItem: (
    <NavItem>
      <AuthNav role="user">
        <NavLink to="/managers" className="nav-link" activeClassName="active">
          Managers
        </NavLink>
      </AuthNav>
    </NavItem>
  ),
  reducer: { managers: reducers },
})
