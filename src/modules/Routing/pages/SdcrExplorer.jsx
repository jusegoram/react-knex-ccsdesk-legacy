//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { Card, Container, Row, Col, Input } from 'reactstrap'
import ReactTable from 'react-table'
import { Link } from 'react-router-dom'

import PageLayout from '../../util/components/PageLayout'

import SDCR_QUERY from '../queries/sdcr.graphql'

class SdcrExplorer extends React.Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }
  onChange(e) {
    this.props.setActivityNumber(e.target.value.toUpperCase())
  }
  render() {
    const { routes, loading } = this.props
    const activityNumber = this.props.activityNumber || ''
    const columns = [
      {
        Header: 'Tech Id',
        accessor: 'techId',
        Cell: ({ original: { cid, techId } }) => <Link to={`/tech/${cid}`}>{techId}</Link>,
      },
      { Header: 'Subcontractor', accessor: 'subcontractor' },
      { Header: 'First Name', accessor: 'firstName' },
      { Header: 'Last Name', accessor: 'lastName' },
      { Header: 'Distance (mi)', id: 'distance', accessor: d => (d.distance / 1609.344).toFixed(1) },
      { Header: 'Has Skill', id: 'hasSkill', accessor: d => (d.hasSkill ? 'True' : 'False') },
      { Header: 'Is Working Today', id: 'workingThatDay', accessor: d => (d.workingThatDay ? 'True' : 'False') },
      { Header: 'Timeslot Empty', id: 'hasTimeslotFree', accessor: d => (d.hasTimeslotFree ? 'True' : 'False') },
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
          <Card style={{ padding: 5, marginBottom: 10 }}>
            <Container fluid>
              <Row>
                <Col xs="12">
                  Activity Number:
                  <Input type="text" value={activityNumber} onChange={this.onChange} />
                </Col>
              </Row>
            </Container>
          </Card>
          {routes && routes.length === 0 && <Card style={{ padding: 20 }}>No results to display</Card>}
          {routes &&
            routes.length !== 0 && (
              <Card style={{ padding: 20, width: '100%', height: 'calc(100% - 100px)' }}>
                <ReactTable
                  style={{ backgroundColor: 'white' }}
                  filterable
                  className="-striped -highlight"
                  data={routes}
                  columns={columns}
                  loading={loading} // Display the loading overlay when we need it
                  defaultPageSize={10}
                />
              </Card>
            )}
        </div>
      </PageLayout>
    )
  }
}

SdcrExplorer.propTypes = {
  activityNumber: PropTypes.string,
  setActivityNumber: PropTypes.func.isRequired,
  routes: PropTypes.array,
  loading: PropTypes.bool.isRequired,
}

export default compose(
  connect(
    state => ({
      activityNumber: state.routing.activityNumber,
    }),
    dispatch => ({
      setActivityNumber(activityNumber) {
        dispatch({
          type: 'ROUTING/SET_ACTIVITY_NUMBER',
          value: activityNumber,
        })
      },
    })
  ),
  graphql(SDCR_QUERY, {
    options: props => {
      return {
        fetchPolicy: 'network-only',
        variables: {
          activityNumber: props.activityNumber,
        },
      }
    },
    props: ({ data }) => {
      return { routes: data.routing, loading: data.loading }
    },
  })
)(SdcrExplorer)
