//CCS_UNIQUE Y044GWN4VZG
// React
import React from 'react'
import { NavLink } from 'react-router-dom'

// Web UI
import { NavItem } from 'reactstrap'

import { AuthRoute, AuthNav } from '../util/components/Auth'

// Component and helpers
import reducers from './reducers'
import ErrorCodes from './containers/ErrorCodes'

import Feature from '../ClientFeature'

export default new Feature({
  route: [<AuthRoute role="user" exact path="/errorCodes" component={ErrorCodes} />],
  navItem: (
    <NavItem>
      <AuthNav role="user">
        <NavLink to="/errorCodes" className="nav-link" activeClassName="active">
          Error Codes
        </NavLink>
      </AuthNav>
    </NavItem>
  ),
  reducer: { reference: reducers },
})
