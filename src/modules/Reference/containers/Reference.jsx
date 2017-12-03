//CCS_UNIQUE MZIPE9BQV3I
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import Helmet from 'react-helmet'
import { Table } from 'reactstrap'

import PageLayout from '../../util/components/PageLayout'

import getAllEnums from '../queries/getAllEnums.graphql'

class Reference extends React.Component {
  render() {
    const { loading, referenceEnums } = this.props
    if (loading) {
      return (
        <PageLayout>
          <Helmet title="Loading..." />
          <h3>Loading...</h3>
        </PageLayout>
      )
    }

    // debugger
    const table = _.map(referenceEnums, 'values')
    const tableLength = _.maxBy(table, 'length').length
    const rows = _.range(0, tableLength).map(rowNum => _.map(table, rowNum))

    return (
      <PageLayout>
        <Helmet title="Reference" />
        <Table striped hover bordered style={{ width: '100%', minWidth: 1400 }}>
          <thead>
            <tr>{referenceEnums.map(referenceEnum => <th key={referenceEnum.id}>{referenceEnum.name}</th>)}</tr>
          </thead>
          <tbody>{rows.map(row => <tr>{row.map(value => <td>{value}</td>)}</tr>)}</tbody>
        </Table>
      </PageLayout>
    )
  }
}

Reference.propTypes = {
  loading: PropTypes.bool.isRequired,
  referenceEnums: PropTypes.arrayOf(PropTypes.object),
}

export default compose(
  graphql(getAllEnums, {
    props({ data: { loading, referenceEnums } }) {
      return { loading, referenceEnums }
    },
  })
)(Reference)
