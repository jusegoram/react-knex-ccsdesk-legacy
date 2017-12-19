//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { Card, Container, Row, Col } from 'reactstrap'

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
    return <Card>{JSON.stringify(pendingJobs)}</Card>
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
