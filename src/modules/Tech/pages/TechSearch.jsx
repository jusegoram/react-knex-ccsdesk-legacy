//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { compose } from 'react-apollo'
import { connect } from 'react-redux'

import PageLayout from '../../util/components/PageLayout'
import TechSearchQuery from '../components/TechSearchQuery'
// import TechSearchResults from '../components/TechSearchResults'

class TechSearch extends React.Component {
  render() {
    const { searchParams, onSearchParamChanged } = this.props
    return (
      <PageLayout>
        <Helmet title="CCS Desk - Techs" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <TechSearchQuery searchParams={searchParams} onSearchParamChanged={onSearchParamChanged} />
          {/* <TechSearchResults /> */}
        </div>
      </PageLayout>
    )
  }
}

TechSearch.propTypes = {
  searchParams: PropTypes.object,
  onSearchParamChanged: PropTypes.func.isRequired,
}

export default compose(
  connect(
    state => ({
      searchParams: state.techs.searchParams,
    }),
    dispatch => ({
      onSearchParamChanged(searchParam) {
        dispatch({
          type: 'Techs/UPDATE_SEARCH_PARAMS',
          value: searchParam,
        })
      },
    })
  )
)(TechSearch)
