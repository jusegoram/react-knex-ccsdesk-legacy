//CCS_UNIQUE 0QKYLJ2L81UA
import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import PageLayout from '../../util/components/PageLayout'
import ManagerFinder from '../containers/ManagerFinder'
import Manager from '../containers/Manager'

class Managers extends React.Component {
  render() {
    const { selectedManagerId } = this.props
    return (
      <PageLayout>
        <Helmet title="CCS Desk - Managers" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            border: '1px solid #ccc',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          <ManagerFinder />
          {!selectedManagerId ? null : <Manager />}
        </div>
      </PageLayout>
    )
  }
}

Managers.propTypes = {
  selectedManagerId: PropTypes.number,
}

export default connect(state => ({
  selectedManagerId: state.managers.selectedManagerId,
}))(Managers)
