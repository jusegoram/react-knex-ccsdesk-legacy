//CCS_UNIQUE SBJE0MZE5SG
import { debounce } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
// import { Input } from 'reactstrap'
import sizeMe from 'react-sizeme'
import { connect } from 'react-redux'

import RoutelogList from './RoutelogList'

import getRoutelogs from '../queries/getRoutelogs.graphql'

class RoutelogFinder extends React.Component {
  constructor(props) {
    super(props)
    this.debouncedOnQueryChange = debounce(props.onQueryChanged, 300)
  }
  render() {
    const { routelogs, loading, selectedRoutelog, onRoutelogSelected /*, queryString*/ } = this.props
    if (!loading && routelogs.length && !selectedRoutelog) {
      onRoutelogSelected(routelogs[0].date)
    }
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          borderRight: '5px solid #ccc',
          width: 150,
          overflowY: 'scroll',
        }}
      >
        {/* <div style={{ borderBottom: '1px solid #ccc' }}>
          <Input
            style={{ border: 0 }}
            placeholder="YYYY-MM-DD"
            type="text"
            defaultValue={queryString}
            onChange={e => this.debouncedOnQueryChange(e.target.value)}
          />
        </div> */}
        <div style={{ flex: 1 }}>
          {loading ? null : (
            <RoutelogList routelogs={routelogs} selectedRoutelog={selectedRoutelog} onClick={onRoutelogSelected} />
          )}
        </div>
      </div>
    )
  }
}

RoutelogFinder.propTypes = {
  loading: PropTypes.bool.isRequired,
  routelogs: PropTypes.array,
  selectedRoutelog: PropTypes.string,
  onRoutelogSelected: PropTypes.func.isRequired,
  queryString: PropTypes.string,
  onQueryChanged: PropTypes.func.isRequired,
}

export default compose(
  connect(
    state => ({
      queryString: state.routelogs.queryString,
      selectedRoutelog: state.routelogs.selectedRoutelog,
    }),
    dispatch => ({
      onQueryChanged(queryString) {
        dispatch({
          type: 'Routelogs/UPDATE_QUERY_STRING',
          value: queryString,
        })
      },
      onRoutelogSelected(routelogDate) {
        dispatch({
          type: 'Routelogs/UPDATE_SELECTED_ROUTELOG',
          value: routelogDate,
        })
      },
    })
  ),
  graphql(getRoutelogs, {
    options: () => {
      return {
        fetchPolicy: 'network-only',
        variables: {},
      }
    },
    props: ({ data: { loading, routelogDays } }) => {
      return { loading, routelogs: routelogDays }
    },
  })
)(RoutelogFinder)
