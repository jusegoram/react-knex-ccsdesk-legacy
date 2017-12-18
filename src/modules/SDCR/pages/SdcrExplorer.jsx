//CCS_UNIQUE YXQM4TSPWUH
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql, compose } from 'react-apollo'
import ReactTable from 'react-table'
import moment from 'moment'

import PageLayout from '../../util/components/PageLayout'

import SDCR_QUERY from '../queries/sdcr.graphql'

class SdcrExplorer extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { sdcr, loading } = this.props
    const columns = [
      {
        Header: 'DMA',
        accessor: 'groupName',
        filterMethod: (filter, row) => {
          return (row[filter.id] + '').toLowerCase().indexOf(filter.value.toLowerCase()) !== -1
        },
      },
      { Header: 'Numerator', accessor: 'numerator', filterable: false },
      {
        Header: 'Percentage',
        id: 'percentage',
        accessor: d => parseFloat(d.percentage).toFixed(1) + '%',
        filterable: false,
      },
    ]

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
          <ReactTable
            style={{ backgroundColor: 'white' }}
            filterable
            className="-striped -highlight"
            data={sdcr.data}
            columns={columns}
            loading={loading} // Display the loading overlay when we need it
          />
        </div>
      </PageLayout>
    )
  }
}

SdcrExplorer.propTypes = {
  sdcr: PropTypes.object,
  loading: PropTypes.bool.isRequired,
}

export default compose(
  graphql(SDCR_QUERY, {
    options: () => ({
      fetchPolicy: 'network-only',
      variables: {
        params: {
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          scopeType: null,
          scopeName: null,
          groupType: 'dma',
        },
      },
    }),
    props: ({ data: { loading, sdcr } }) => ({
      sdcr: sdcr,
      loading,
    }),
  })
)(SdcrExplorer)
