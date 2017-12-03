//CCS_UNIQUE Z978NL4TF5
import React from 'react'
import PropTypes from 'prop-types'

import Sidebar from './Sidebar'
import Topbar from './Topbar'

const PageLayout = ({ children }) => {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'row' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div className="mainContent" style={{ flex: 1, backgroundColor: '#f1f1f1', padding: 15 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool,
}

export default PageLayout
