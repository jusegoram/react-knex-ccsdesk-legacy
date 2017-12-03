//CCS_UNIQUE SDJ4EJURGAG
import React from 'react'
import { Nav } from 'reactstrap'

import modules from '../../../index.client'

const collapsed = false
const NavBar = () => {
  return (
    <div style={{ width: 240, backgroundColor: '#2d3446' }}>
      <div
        style={{
          height: 70,
          backgroundColor: 'rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: '#F9F9F9',
            letterSpacing: 3,
            fontWeight: 300,
            fontSize: 21,
            lineHeight: '70px',
          }}
        >
          CCS&nbsp;DESK
        </span>
      </div>
      <Nav vertical style={{ marginTop: 15 }}>
        {modules.navItems}
      </Nav>
    </div>
  )
}

export default NavBar
