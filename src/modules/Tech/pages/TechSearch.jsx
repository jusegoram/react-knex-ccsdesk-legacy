//CCS_UNIQUE YXQM4TSPWUH
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql, compose } from 'react-apollo'
import ReactTable from 'react-table'

import PageLayout from '../../util/components/PageLayout'

import TECH_PAGE_QUERY from '../queries/techPage.graphql'
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
        checked={selected[original.cid] || false}
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
      data: !techPage ? [] : techPage.techs.map(t => ({ ...t, groupNames: JSON.parse(t.groupNames) })),
      pages: !techPage ? -1 : Math.ceil(techPage.totalCount / techPage.limit),
      loading: loading,
      columns: _.filter([
        {
          Header: '✔',
          filterable: false,
          width: 30,
          Cell: this.createSelectCheckbox,
        },
        { Header: 'Tech Id', accessor: 'techId' },
        { Header: 'First Name', accessor: 'firstName' },
        { Header: 'Last Name', accessor: 'lastName' },
        { Header: 'HSP', accessor: 'source' },
        { Header: 'Company', accessor: 'company' },
        { Header: 'DMA', id: 'DMA', accessor: 'groupNames.DMA' },
        { Header: 'Office', id: 'Office', accessor: 'groupNames.Office' },
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
  graphql(TECH_PAGE_QUERY, {
    options: () => ({
      fetchPolicy: 'network-only',
      variables: { limit: 20, offset: 0, sorts: [], filters: [] },
    }),
    props: ({ data: { loading, techPage, refetch } }) => ({ loading, techPage, refetch }),
  })
)(TechSearch)
