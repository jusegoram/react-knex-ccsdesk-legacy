//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import PageLayout from '../../util/components/PageLayout'
import RoutelogFinder from '../containers/RoutelogFinder'
import Routelog from '../containers/Routelog'

class RoutelogExplorer extends React.Component {
  render() {
    const { selectedRoutelog } = this.props
    return (
      <PageLayout>
        <Helmet title="CCS Desk - Routelog Explorer" />
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
          <RoutelogFinder />
          {!selectedRoutelog ? null : <Routelog />}
        </div>
      </PageLayout>
    )
  }
}

RoutelogExplorer.propTypes = {
  selectedRoutelog: PropTypes.string,
}

export default connect(state => ({
  selectedRoutelog: state.routelogs.selectedRoutelog,
}))(RoutelogExplorer)
