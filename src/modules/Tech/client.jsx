//CCS_UNIQUE 7DJQXAL6RHO
// React
import React from 'react'
import { NavLink } from 'react-router-dom'

// Web UI
import { NavItem } from 'reactstrap'

import { AuthRoute, AuthNav } from '../util/components/Auth'

// Component and helpers
// import MyTechs from './containers/MyTechs.page'
import Invite from '../User/containers/Invite'
import Tech from './pages/Tech'
import TechSearch from './pages/TechSearch'
import reducers from './reducers'

import Feature from '../ClientFeature'

export default new Feature({
  route: [
    // {/* <AuthRoute role="user" exact path="/tech-lookup" component={Techs} />,
    // <AuthRoute role="user" forClients={true} exact path="/my-techs" component={MyTechs} />, */}
    <AuthRoute role="user" exact path="/techs" component={TechSearch} />,
    <AuthRoute role="user" exact path="/tech/:cid" component={Tech} />,
    <AuthRoute exact path="/invite-user" role="user" forClients={true} component={Invite} />,
  ],
  navItem: [
    <NavItem>
      <NavLink to="/techs" className="nav-link">
        Techs
      </NavLink>
    </NavItem>,
    <NavItem>
      <AuthNav role={['Admin', 'Manager']} forClients={true}>
        <NavLink href="/invite-user" to="/invite-user" className="nav-link">
          Invite User
        </NavLink>
      </AuthNav>
    </NavItem>,
  ],
  reducer: { techs: reducers },
})
