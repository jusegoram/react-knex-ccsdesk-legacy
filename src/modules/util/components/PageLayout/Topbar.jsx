//CCS_UNIQUE PSLZBDMOBSP
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { AuthProfile, AuthLogin } from '../Auth'

const Topbar = ({ route }) => {
  const routerTitles = {
    '/reference': 'Reference',
    '/errorCodes': 'Error Codes',
    '/techs': 'Techs',
    '/managers': 'Managers',
    '/routelogs': 'Routelog Explorer',
    '/my-techs': 'My Techs',
    '/invite-user': 'Invite User',
  }
  return (
    <div style={{ height: 70, position: 'relative' }}>
      <i className="icon ion-navicon" />
      <span style={{ lineHeight: '70px', fontSize: 21, paddingLeft: 25 }}>{routerTitles[route] || ''}</span>
      <div style={{ position: 'absolute', right: 100, top: 15 }}>
        <AuthProfile />
      </div>
      <div style={{ position: 'absolute', right: 15, top: 15 }}>
        <AuthLogin />
      </div>
    </div>
  )
}

Topbar.propTypes = {
  route: PropTypes.string,
}

export default connect(state => ({
  route: state.router && state.router.location && state.router.location.pathname,
}))(Topbar)
