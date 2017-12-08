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

    const productionCount = _.sum(_.map(_.values(stats), 'Production'))
    const serviceCount = _.sum(_.map(_.values(stats), 'Service'))
    const totalCount = productionCount + serviceCount

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
          <Container fluid style={{ margin: 0 }}>
            <Row>
              <Col>
                <Table bordered striped style={{ textAlign: 'center' }}>
                  <thead>
                    <tr>
                      <th rowSpan="2">Status</th>
                      <th colSpan="2">Production</th>
                      <th colSpan="2">Repairs</th>
                      <th colSpan="2">All In</th>
                    </tr>
                    <tr>
                      <th>Count</th>
                      <th>Percentage</th>
                      <th>Count</th>
                      <th>Percentage</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_.map(stats, (statusStats, status) => (
                      <tr key={status}>
                        <td>{status}</td>
                        <td>{statusStats.Production}</td>
                        <td>{(100 * statusStats.Production / productionCount).toFixed(1)}%</td>
                        <td>{statusStats.Service}</td>
                        <td>{(100 * statusStats.Service / serviceCount).toFixed(1)}%</td>
                        <td>{statusStats.Production + statusStats.Service}</td>
                        <td>{(100 * (statusStats.Production + statusStats.Service) / totalCount).toFixed(1)}%</td>
                      </tr>
                    ))}
                    <tr>
                      <th>Total</th>
                      <th>{productionCount}</th>
                      <th>{(100 * productionCount / totalCount).toFixed(1)}%</th>
                      <th>{serviceCount}</th>
                      <th>{(100 * serviceCount / totalCount).toFixed(1)}%</th>
                      <th>{totalCount}</th>
                      <th>100%</th>
                    </tr>
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
