//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { Card, Container, Row, Col } from 'reactstrap'
import ReactTable from 'react-table'
import moment from 'moment'

import NEARBY_PENDING_JOBS from '../queries/nearbyPendingJobs.graphql'

class PendingJobsList extends React.Component {
  render() {
    const { loading, pendingJobs } = this.props
    if (loading) {
      return (
        <Card>
          <Container>
            <Row>
              <Col>Loading</Col>
            </Row>
          </Container>
        </Card>
      )
    }
    const columns = [
      { Header: 'HSP', accessor: 'hsp' },
      { Header: 'Activity Number', accessor: 'activityNumber' },
      { Header: 'Status', accessor: 'status' },
      {
        Header: 'Due Date',
        id: 'dueDate',
        accessor: r => moment.utc(r.dueDate).format('MM/DD/YY h:mm a'),
        sortMethod: (a, b) => {
          const mA = moment(a, 'MM/DD/YY h:mm a')
          const mB = moment(b, 'MM/DD/YY h:mm a')
          return mA.isBefore(mB) ? -1 : mB.isBefore(mA) ? 1 : 0
        },
      },
      { Header: 'Address', accessor: 'address' },
      { Header: 'Distance (mi)', accessor: r => parseFloat((r.distance / 1609.34).toFixed(1)), id: 'distance' },
    ]
    return (
      <Card>
        <ReactTable
          style={{ backgroundColor: 'white' }}
          filterable
          className="-striped -highlight"
          data={pendingJobs}
          columns={columns}
          loading={loading} // Display the loading overlay when we need it
        />
      </Card>
    )
  }
}

PendingJobsList.propTypes = {
  address: PropTypes.string.isRequired,
  radius: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  pendingJobs: PropTypes.array,
}

export default compose(
  graphql(NEARBY_PENDING_JOBS, {
    options: props => ({
      fetchPolicy: 'network-only',
      variables: { address: props.address, radius: props.radius },
    }),
    props: ({ data: { loading, pendingJobs } }) => ({
      loading,
      pendingJobs,
    }),
  })
)(PendingJobsList)
