//CCS_UNIQUE 41OR6KI5TZU
// React
import React from 'react'
import { Route } from 'react-router-dom'
import { NavItem, NavLink } from 'reactstrap'

// Component and helpers
import Profile from './containers/Profile'
import Users from './components/Users'
import Register from './containers/Register'
import Login from './containers/Login'
import Invite from './containers/Invite'
import RootConfig from './containers/RootConfig'
import reducers from './reducers'

import { AuthRoute, AuthLogin, AuthProfile, AuthNav } from '../util/components/Auth'

import Feature from '../ClientFeature'

function tokenMiddleware(req, options) {
  options.headers['x-token'] = window.localStorage.getItem('token')
  options.headers['x-refresh-token'] = window.localStorage.getItem('refreshToken')
}

function tokenAfterware(res, options) {
  const token = options.headers['x-token']
  const refreshToken = options.headers['x-refresh-token']
  if (token) {
    window.localStorage.setItem('token', token)
  }
  if (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken)
  }
}

function connectionParam() {
  return {
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken'),
  }
}

export default new Feature({
  route: [
    <AuthRoute exact path="/profile" role="user" component={Profile} />,
    <AuthRoute exact path="/users" role="admin" component={Users} />,
    <AuthRoute exact path="/root" role="admin" component={RootConfig} />,
    // {/* <Route exact path="/users/:id" component={UserEdit} />, */}
    <Route exact path="/register" component={Register} />,
    <Route exact path="/" component={Login} />,
    // {/* <Route exact path="/forgot-password" component={ForgotPassword} />, */}
    // {/* <Route exact path="/reset-password/:token" component={ResetPassword} />, */}
    <AuthRoute exact path="/invite-user" role="user" forClients={true} component={Invite} />,
  ],
  navItemRight: [
    <NavItem>
      <AuthProfile />
    </NavItem>,
    <NavItem>
      <AuthLogin />
    </NavItem>,
  ],
  reducer: { user: reducers },
  middleware: tokenMiddleware,
  afterware: tokenAfterware,
  connectionParam: connectionParam,
})
