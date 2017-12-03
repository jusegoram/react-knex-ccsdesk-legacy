//CCS_UNIQUE 14V467W1PHJ
import { debounce } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { Input } from 'reactstrap'
import sizeMe from 'react-sizeme'
import { connect } from 'react-redux'

import ManagerList from '../components/ManagerList'

import managerSearch from '../queries/search.graphql'

class Managers extends React.Component {
  constructor(props) {
    super(props)
    this.debouncedOnQueryChange = debounce(props.onQueryChanged, 300)
  }
  render() {
    const { managerPage, loading, selectedManagerId, onManagerSelected, queryString } = this.props

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          borderRight: '5px solid #ccc',
          width: 300,
        }}
      >
        <div style={{ borderBottom: '1px solid #ccc' }}>
          <Input
            style={{ border: 0 }}
            placeholder="Search Managers"
            type="text"
            defaultValue={queryString}
            onChange={e => this.debouncedOnQueryChange(e.target.value)}
          />
        </div>
        <div style={{ height: 25, textAlign: 'center', borderBottom: '1px solid #ccc', backgroundColor: '#eee' }}>
          {loading ? <small>Loading...</small> : <small>{managerPage.totalCount} Results</small>}
        </div>

        <div style={{ flex: 1 }}>
          {loading ? null : (
            <ManagerList
              managers={managerPage.managers}
              selectedManagerId={selectedManagerId}
              onClick={onManagerSelected}
            />
          )}
        </div>
      </div>
    )
  }
}

Managers.propTypes = {
  loading: PropTypes.bool.isRequired,
  managerPage: PropTypes.object,
  fetchMore: PropTypes.func.isRequired,
  selectedManagerId: PropTypes.number,
  onManagerSelected: PropTypes.func.isRequired,
  queryString: PropTypes.string,
  onQueryChanged: PropTypes.func.isRequired,
}

export default compose(
  sizeMe({ monitorHeight: true }),
  connect(
    state => ({
      queryString: state.managers.queryString,
      selectedManagerId: state.managers.selectedManagerId,
    }),
    dispatch => ({
      onQueryChanged(queryString) {
        dispatch({
          type: 'Managers/UPDATE_QUERY_STRING',
          value: queryString,
        })
      },
      onManagerSelected(managerId) {
        dispatch({
          type: 'Managers/UPDATE_SELECTED_MANAGER',
          value: managerId,
        })
      },
    })
  ),
  graphql(managerSearch, {
    options: props => {
      const { size, queryString } = props
      const limit = Math.floor((size.height - 62) / 65)
      return {
        fetchPolicy: 'cache-and-network',
        variables: { limit, offset: 0, queryString },
      }
    },
    props: ({ data }) => data,
  })
)(Managers)
