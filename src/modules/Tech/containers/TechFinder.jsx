//CCS_UNIQUE SBJE0MZE5SG
import { debounce } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { Input } from 'reactstrap'
import sizeMe from 'react-sizeme'
import { connect } from 'react-redux'

import TechList from '../components/TechList'

import techsQuery from '../queries/techs.graphql'
import currentUserQuery from '../../util/queries/CurrentUserQuery.graphql'

class Techs extends React.Component {
  constructor(props) {
    super(props)
    this.debouncedOnQueryChange = debounce(props.onQueryChanged, 300)
  }
  render() {
    console.log(this.props)
    const { techs: techPage, loading, selectedTechId, onTechSelected, queryString } = this.props
    const { techs, totalCount } = techPage || {}
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
            placeholder="Search Techs"
            type="text"
            defaultValue={queryString}
            onChange={e => this.debouncedOnQueryChange(e.target.value)}
          />
        </div>
        <div style={{ height: 25, textAlign: 'center', borderBottom: '1px solid #ccc', backgroundColor: '#eee' }}>
          {loading ? <small>Loading...</small> : <small>{totalCount} Results</small>}
        </div>

        <div style={{ flex: 1 }}>
          {loading ? null : <TechList techs={techs} selectedTechId={selectedTechId} onClick={onTechSelected} />}
        </div>
      </div>
    )
  }
}

Techs.propTypes = {
  loading: PropTypes.bool.isRequired,
  techs: PropTypes.object,
  fetchMore: PropTypes.func.isRequired,
  selectedTechId: PropTypes.string,
  onTechSelected: PropTypes.func.isRequired,
  queryString: PropTypes.string,
  onQueryChanged: PropTypes.func.isRequired,
  myTechs: PropTypes.bool,
}

export default compose(
  sizeMe({ monitorHeight: true }),
  connect(
    state => ({
      queryString: state.techs.queryString,
      selectedTechId: state.techs.selectedTechId,
    }),
    dispatch => ({
      onQueryChanged(queryString) {
        dispatch({
          type: 'Techs/UPDATE_QUERY_STRING',
          value: queryString,
        })
      },
      onTechSelected(techId) {
        dispatch({
          type: 'Techs/UPDATE_SELECTED_TECH',
          value: techId,
        })
      },
    })
  ),
  graphql(techsQuery, {
    options: props => {
      const { size, queryString, myTechs } = props
      const limit = Math.floor((size.height - 62) / 65)
      return {
        fetchPolicy: 'cache-and-network',
        variables: { limit, offset: 0, myTechs, queryString },
      }
    },
    props: ({ data }) => data,
  })
)(Techs)
