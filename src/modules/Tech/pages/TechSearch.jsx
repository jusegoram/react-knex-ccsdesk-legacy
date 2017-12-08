//CCS_UNIQUE YXQM4TSPWUH
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql, compose } from 'react-apollo'
import ReactTable from 'react-table'
import { Input, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Promise from 'bluebird'

import PageLayout from '../../util/components/PageLayout'

import TECH_PAGE_QUERY from '../queries/techPage.graphql'
import CURRENT_USER_QUERY from '../../util/queries/CurrentUserQuery.graphql'
import CLAIM_TECH from '../queries/claimTech.graphql'
import UNCLAIM_TECH from '../queries/unclaimTech.graphql'

// import TechSearchQuery from '../components/TechSearchQuery'
// import TechSearchResults from '../components/TechSearchResults'

class TechSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selected: {} }
    this.createSelectCheckbox = this.createSelectCheckbox.bind(this)
    this.onRowClicked = this.onRowClicked.bind(this)
    this.claimSelected = this.claimSelected.bind(this)
    this.unclaimSelected = this.unclaimSelected.bind(this)
  }
  createSelectCheckbox({ original }) {
    const { selected } = this.state
    return <input type="checkbox" checked={selected[original.cid] || false} />
  }
  onRowClicked({ original }) {
    const { selected } = this.state
    if (!selected[original.cid])
      this.setState({
        selected: { ...selected, [original.cid]: original },
      })
    else
      this.setState({
        selected: _.omit(selected, original.cid),
      })
  }
  async claimSelected() {
    const { claimTech, refetchCurrentUser } = this.props
    const { selected } = this.state
    const selectedTechs = _.values(selected)
    let numSuccesses = 0
    await Promise.resolve(selectedTechs)
    .map(async tech => {
      try {
        await claimTech({ cid: tech.cid })
        numSuccesses++
      } catch (e) {
        console.error(e)
      }
    })
    .then(() => refetchCurrentUser())
    if (selectedTechs.length === numSuccesses) alert('All techs have been successfully claimed')
    else alert(`${numSuccesses} out of ${selectedTechs.length} techs were successfully claimed.`)
  }
  async unclaimSelected() {
    const { unclaimTech, refetchCurrentUser } = this.props
    const { selected } = this.state
    const selectedTechs = _.values(selected)
    let numSuccesses = 0
    await Promise.resolve(selectedTechs)
    .map(async tech => {
      try {
        await unclaimTech({ cid: tech.cid })
        numSuccesses++
      } catch (e) {
        console.error(e)
      }
    })
    .then(() => refetchCurrentUser())
    if (selectedTechs.length === numSuccesses) alert('All techs have been successfully unclaimed')
    else alert(`${numSuccesses} out of ${selectedTechs.length} techs were successfully unclaimed.`)
  }
  render() {
    const { techPageLoading, techPage, refetchTechPage, currentUser } = this.props
    const selectedTechs = _.values(this.state.selected)
    const tableProps = {
      data: !techPage ? [] : techPage.techs.map(t => ({ ...t, groupNames: JSON.parse(t.groupNames) })),
      pages: !techPage ? -1 : Math.ceil(techPage.totalCount / techPage.limit),
      loading: techPageLoading,
      columns: _.filter([
        currentUser &&
          currentUser.role && {
          Header: '✔',
          filterable: false,
          sortable: false,
          width: 30,
          Cell: this.createSelectCheckbox,
        },
        currentUser &&
          currentUser.role && {
          Header: 'Your Tech',
          width: 100,
          sortable: false,
          style: { textAlign: 'center' },
          id: 'My Tech',
          Filter: ({ filter, onChange }) => (
            <Input
              type="select"
              size="sm"
              onChange={event => onChange(event.target.value === 'all' ? 'null' : event.target.value)}
              style={{ width: '100%' }}
              value={filter && filter.value}
            >
              <option value="all">All</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </Input>
          ),
          Cell: ({ original: { cid } }) => (currentUser.techs.indexOf(cid) === -1 ? 'No' : 'Yes'),
        },
        {
          Header: 'Tech Id',
          accessor: 'techId',
          Cell: ({ original: { cid, techId } }) => <Link to={`/tech/${cid}`}>{techId}</Link>,
        },
        { Header: 'First Name', accessor: 'firstName' },
        { Header: 'Last Name', accessor: 'lastName' },
        currentUser &&
          currentUser.role !== null &&
          currentUser.company !== currentUser.hsp && { Header: 'HSP', accessor: 'source' },
        currentUser && currentUser.company === currentUser.hsp && { Header: 'Company', accessor: 'company' },
        { Header: 'DMA', id: 'DMA', accessor: 'groupNames.DMA', sortable: false },
        { Header: 'Office', id: 'Office', accessor: 'groupNames.Office', sortable: false },
      ]),
    }

    const onFetchData = state => {
      if (techPageLoading) return
      const refetchVariables = {
        offset: state.page * state.pageSize,
        limit: state.pageSize,
        sorts: state.sorted,
        filters: state.filtered,
      }
      refetchTechPage(refetchVariables)
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
          {currentUser &&
            currentUser.role && (
              <div
                className="d-flex justify-content-between"
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
              >
                <div>{selectedTechs.length} Techs Selected</div>
                <div className="clearfix">
                  <Button className="mr-3" size="sm" color="primary" onClick={this.claimSelected}>
                    Claim All
                  </Button>
                  <Button size="sm" color="danger" onClick={this.unclaimSelected}>
                    Unclaim All
                  </Button>
                </div>
              </div>
            )}
          <ReactTable
            style={{ backgroundColor: 'white' }}
            filterable
            manual
            className="-striped -highlight"
            getTrProps={(state, data) => ({ onClick: () => data && this.onRowClicked({ original: data.original }) })}
            onFetchData={onFetchData}
            {...tableProps}
          />
        </div>
      </PageLayout>
    )
  }
}

TechSearch.propTypes = {
  techPageLoading: PropTypes.bool.isRequired,
  techPage: PropTypes.object,
  refetchTechPage: PropTypes.func.isRequired,
  currentUserLoading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  refetchCurrentUser: PropTypes.func.isRequired,
  claimTech: PropTypes.func.isRequired,
  unclaimTech: PropTypes.func.isRequired,
}

export default compose(
  graphql(TECH_PAGE_QUERY, {
    options: () => ({
      fetchPolicy: 'network-only',
      variables: { limit: 20, offset: 0, sorts: [], filters: [] },
    }),
    props: ({ data: { loading, techPage, refetch } }) => ({
      techPageLoading: loading,
      techPage,
      refetchTechPage: refetch,
    }),
  }),
  graphql(CLAIM_TECH, {
    props: ({ mutate }) => ({
      claimTech: ({ cid }) => mutate({ variables: { cid } }),
    }),
  }),
  graphql(UNCLAIM_TECH, {
    props: ({ mutate }) => ({
      unclaimTech: ({ cid }) => mutate({ variables: { cid } }),
    }),
  }),
  graphql(CURRENT_USER_QUERY, {
    options: () => ({
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data: { loading, currentUser, refetch } }) => {
      return { currentUserLoading: loading, currentUser, refetchCurrentUser: refetch }
    },
  })
)(TechSearch)
