//CCS_UNIQUE YXQM4TSPWUH
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql, compose } from 'react-apollo'
import ReactTable from 'react-table'

import PageLayout from '../../util/components/PageLayout'

import techsQuery from '../queries/techPage.graphql'
// import TechSearchQuery from '../components/TechSearchQuery'
// import TechSearchResults from '../components/TechSearchResults'

class TechSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selected: {} }
    this.createSelectCheckbox = this.createSelectCheckbox.bind(this)
  }
  createSelectCheckbox({ original }) {
    const { selected } = this.state
    return (
      <input
        type="checkbox"
        checked={selected[original.cid]}
        onChange={e => {
          if (e.target.checked)
            this.setState({
              selected: { ...selected, [original.cid]: original },
            })
          else
            this.setState({
              selected: _.omit(selected, original.cid),
            })
        }}
      />
    )
  }
  render() {
    const { loading, techPage, refetch } = this.props
    const selectedTechs = _.values(this.state.selected)
    const tableProps = {
      data: !techPage ? [] : techPage.techs,
      pages: !techPage ? -1 : Math.ceil(techPage.totalCount / techPage.limit),
      loading: loading,
      columns: _.filter([
        {
          Header: '✔',
          filterable: false,
          width: 30,
          Cell: this.createSelectCheckbox.bind(this),
        },
        { Header: 'Tech Id', accessor: 'techId' },
        { Header: 'First Name', accessor: 'firstName' },
        { Header: 'Last Name', accessor: 'lastName' },
        { Header: 'HSP', accessor: 'source' },
        { Header: 'Company', accessor: 'company' },
        { Header: 'Phone Number', accessor: 'phoneNumber' },
      ]),
    }
    const onFetchData = state => {
      if (loading) return
      const refetchVariables = {
        offset: state.page * state.pageSize,
        limit: state.pageSize,
        sorts: state.sorted,
        filters: state.filtered,
      }
      refetch(refetchVariables)
    }

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
          <div style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}>
            {selectedTechs.length} Techs Selected
          </div>
          <ReactTable
            style={{ backgroundColor: 'white' }}
            filterable
            manual
            onFetchData={onFetchData}
            {...tableProps}
          />
        </div>
      </PageLayout>
    )
  }
}

TechSearch.propTypes = {
  loading: PropTypes.bool.isRequired,
  techPage: PropTypes.object,
  refetch: PropTypes.func.isRequired,
}

export default compose(
  graphql(techsQuery, {
    options: () => ({
      fetchPolicy: 'network-only',
      variables: { limit: 20, offset: 0, sorts: [], filters: [] },
    }),
    props: ({ data: { loading, techPage, refetch } }) => ({ loading, techPage, refetch }),
  })
)(TechSearch)
