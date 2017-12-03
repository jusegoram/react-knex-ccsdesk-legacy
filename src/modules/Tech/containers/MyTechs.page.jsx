//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import PageLayout from '../../util/components/PageLayout'
import TechFinder from '../containers/TechFinder'
import Tech from '../containers/Tech'

class Techs extends React.Component {
  render() {
    const { selectedTechId } = this.props
    return (
      <PageLayout>
        <Helmet title="CCS Desk - Techs" />
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
          <TechFinder myTechs />
          {!selectedTechId ? null : <Tech />}
        </div>
      </PageLayout>
    )
  }
}

Techs.propTypes = {
  selectedTechId: PropTypes.string,
}

export default connect(state => ({
  selectedTechId: state.techs.selectedTechId,
}))(Techs)
