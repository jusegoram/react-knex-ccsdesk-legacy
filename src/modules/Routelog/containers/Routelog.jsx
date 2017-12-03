//CCS_UNIQUE E4YI2DOT2IC
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { Container, Row, Col, Table, Button } from 'reactstrap'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import url from 'url'

import getByDate from '../queries/getRoutelogByDate.graphql'

class Routelog extends React.Component {
  render() {
    const { loading, routelog } = this.props
    if (loading) {
      return (
        <div style={{ flex: 1, backgroundColor: '#fff', lineHeight: '32px', fontSize: '32px', padding: 10 }}>
          Loading...
        </div>
      )
    }

    let baseUrl = __DEV__ ? 'http://localhost:3000' : 'https://ccsdesk.com'

    const stats = JSON.parse(routelog.stats)

    const activityCount = _.sum(Object.values(stats).map(n => parseInt(n)))

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottom: '1px solid #ccc',
            padding: 10,
            height: 58,
          }}
        >
          <span style={{ fontSize: 38, lineHeight: '38px' }}>{moment(routelog.date).format('dddd, MMMM Do')}</span>
          <div>
            <Button
              color="success"
              size="md"
              onClick={() => {
                window.open(`${baseUrl}/routelogs/download/${routelog.date}`)
              }}
            >
              Download
            </Button>
          </div>
        </div>
        <div style={{ flex: 1, paddingTop: 10, overflow: 'scroll' }}>
          <Container style={{ margin: 0 }}>
            <Row>
              <Col>
                <h4>Total Count: {activityCount}</h4>
                <Table bordered striped>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(stats).map(status => (
                      <tr key={status}>
                        <td>{status}</td>
                        <td>{stats[status]}</td>
                        <td>{(100 * stats[status] / activityCount).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }
}

Routelog.propTypes = {
  loading: PropTypes.bool.isRequired,
  routelog: PropTypes.object,
}

export default compose(
  connect(state => ({
    date: state.routelogs.selectedRoutelog,
  })),
  graphql(getByDate, {
    options: props => {
      const { date } = props
      return {
        fetchPolicy: 'network-only',
        variables: { date },
      }
    },
    props({ data: { loading, routelogInfo } }) {
      return { loading, routelog: routelogInfo }
    },
  })
)(Routelog)
