//CCS_UNIQUE 4VJ9NRV4E5X
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { Container, Row, Col, Button, Table } from 'reactstrap'
import namecase from 'namecase'
import { connect } from 'react-redux'

import getById from '../queries/getById.graphql'
import getGroups from '../queries/getGroups.graphql'

class Manager extends React.Component {
  render() {
    const { loading, loadingGroups } = this.props
    if (loading || loadingGroups) {
      return (
        <div style={{ flex: 1, backgroundColor: '#fff', lineHeight: '32px', fontSize: '32px', padding: 10 }}>
          Loading...
        </div>
      )
    }
    const { manager, managerGroups } = this.props
    const expectedTypes = ['COMPANY', 'DMA', 'OFFICE', 'SERVICE_REGION', 'TECH_TEAM']
    const augmentedGroups = expectedTypes.map(type => {
      return _.find(managerGroups, { type }) || { type, name: '' }
    })
    const managerName = namecase(`${manager.first_name} ${manager.last_name}`)

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottom: '1px solid #ccc',
            padding: 10,
            paddingLeft: 15,
            height: 52,
          }}
        >
          <div style={{ lineHeight: '32px', fontSize: '32px' }}>{managerName}</div>
          <div>
            <Button
              color="success"
              size="sm"
              onClick={() => {
                window.alert('Call logging is not yet enabled')
              }}
            >
              Start Call Log
            </Button>
          </div>
        </div>
        <div style={{ flex: 1, paddingTop: 10, overflow: 'scroll' }}>
          <Container style={{ margin: 0 }}>
            <Row>
              <Col>
                <div style={{ width: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                  <Table bordered striped>
                    <tbody>
                      {augmentedGroups.map((group, index) => (
                        <tr key={index}>
                          <th>{group.type === 'DMA' ? 'DMA' : namecase(_.startCase(group.type))}</th>
                          <td>
                            {(group.type === 'SERVICE_REGION' || group.type === 'TECH_TEAM'
                              ? group.name
                              : group.type === 'COMPANY' ? 'Multiband' : namecase(group.name)) || ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }
}

Manager.propTypes = {
  loading: PropTypes.bool.isRequired,
  manager: PropTypes.object,
  loadingGroups: PropTypes.bool.isRequired,
  managerGroups: PropTypes.object,
}

export default compose(
  connect(state => ({
    id: state.managers.selectedManagerId,
  })),
  graphql(getById, {
    options: props => {
      const { id } = props
      return { variables: { id } }
    },
    props({ data: { loading, manager } }) {
      return { loading, manager }
    },
  }),
  graphql(getGroups, {
    options: props => {
      const { id } = props
      return { variables: { id } }
    },
    props({ data: { loading, managerGroups } }) {
      return { loadingGroups: loading, managerGroups }
    },
  })
)(Manager)
