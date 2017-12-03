//CCS_UNIQUE E4YI2DOT2IC
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { Container, Row, Col, Table, Button } from 'reactstrap'
import namecase from 'namecase'
import { connect } from 'react-redux'
import CURRENT_USER_QUERY from '../../util/queries/CurrentUserQuery.graphql'
import techQuery from '../queries/tech.graphql'
import claimTech from '../queries/claimTech.graphql'
import unclaimTech from '../queries/unclaimTech.graphql'
import findManagersQuery from '../queries/findManagersForWorker.graphql'

const groupTypePriority = {
  COMPANY: 0,
  DMA: -2,
  OFFICE: -3,
  SERVICE_REGION: -4,
  TECH_TEAM: -5,
}

class Tech extends React.Component {
  render() {
    const { loading } = this.props
    if (loading) {
      return (
        <div style={{ flex: 1, backgroundColor: '#fff', lineHeight: '32px', fontSize: '32px', padding: 10 }}>
          Loading...
        </div>
      )
    }
    console.log(loading)
    console.log(tech)
    const { currentUser, tech, claimTech, unclaimTech } = this.props

    if (!this.fetchingManagers) {
      this.fetchingManagers = true
      this.props.getManagers(tech.tech_id).then(data => {
        console.log('MANAGERS!!!')
        console.log(data)
        const managers = data.data.findManagersForWorker.map(m => JSON.parse(m))
        this.setState({ managers })
      })
    }
    const group_names = JSON.parse(tech.group_names)
    const techName = namecase(`${tech.first_name} ${tech.last_name}`)
    console.log('tech', currentUser)
    const techphone = tech.phone_number
    const formattedTechPhone = !techphone
      ? 'DNE'
      : `(${techphone.slice(0, 3)}) ${techphone.slice(3, 6)}-${techphone.slice(6, 10)}`

    const unsortedContactInfos = []
    if (this.state && this.state.managers) {
      console.log('mana', this.state.managers)
      this.state.managers.forEach(techManager => {
        const techGroups = techManager.techGroups
        console.log('tg', techGroups)
        const managerName = namecase(`${techManager.first_name} ${techManager.last_name}`)
        const phone = techManager.phone_number
        const formattedPhone = !phone ? 'DNE' : `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`
        const matchingIds = _.intersection(_.map(techGroups, 'id'), techManager.parents.map(n => parseInt(n)))
        const groupsById = _.keyBy(techGroups, 'id')
        const matchingGroups = matchingIds.map(id => groupsById[id])
        const mostSignificantMatchingGroup = _.maxBy(matchingGroups, group => groupTypePriority[group.type])
        unsortedContactInfos.push({
          techManager,
          managerName,
          group: mostSignificantMatchingGroup,
          formattedPhone,
        })
      })
    }
    const contactInfos = _.sortBy(
      _.shuffle(unsortedContactInfos),
      contactInfo => groupTypePriority[contactInfo.group.type]
    )
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
          <div style={{ lineHeight: '32px', fontSize: '32px' }}>{techName}</div>
          <div>
            {currentUser &&
              currentUser.company &&
              currentUser.techs.indexOf(tech.cid) === -1 && (
                <Button
                  color="success"
                  size="sm"
                  onClick={() => {
                    claimTech({ cid: tech.cid })
                  }}
                >
                  Claim Tech
                </Button>
              )}
            {currentUser &&
              currentUser.company &&
              currentUser.techs.indexOf(tech.cid) !== -1 && (
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => {
                    unclaimTech({ cid: tech.cid })
                  }}
                >
                  Unclaim Tech
                </Button>
              )}
          </div>
        </div>
        <div style={{ flex: 1, paddingTop: 10, overflow: 'scroll' }}>
          <Container style={{ margin: 0 }}>
            <Row>
              <Col>
                <div style={{ minWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                  <center>
                    <h4>Basic Info</h4>
                  </center>
                  <Table bordered striped>
                    <tbody>
                      <tr>
                        <th>Company</th>
                        <td>{tech.company}</td>
                      </tr>
                      {tech.source != tech.company && (
                        <tr>
                          <th>HSP</th>
                          <td>{tech.source}</td>
                        </tr>
                      )}
                      <tr>
                        <th>Tech ID</th>
                        <td>{tech.tech_id}</td>
                      </tr>
                      <tr>
                        <th>Phone Number</th>
                        <td>{formattedTechPhone}</td>
                      </tr>
                      {_.toPairs(group_names).map(pair => (
                        <tr key={pair[0] + pair[1]}>
                          <td>{pair[0]}</td>
                          <td>{pair[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col>
                <div style={{ minWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                  <center>
                    <h4>Contacts</h4>
                  </center>
                  <Table bordered striped>
                    <thead>
                      <tr>
                        <th>Contact</th>
                        <th>Manages Group</th>
                        <th>Phone Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactInfos.map((
                        { managerName, group, formattedPhone } // techManager
                      ) => (
                        <tr key={managerName + group.id}>
                          <td>
                            {/* <Link to={`/manager/${techManager.id}`}> */}
                            {namecase(managerName)}
                            {/* </Link> */}
                          </td>
                          <td>
                            {(group.type === 'SERVICE_REGION' || group.type === 'TECH_TEAM'
                              ? group.name
                              : namecase(group.name)) || 'Unknown'}
                          </td>
                          <td>{formattedPhone}</td>
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

Tech.propTypes = {
  loading: PropTypes.bool.isRequired,
  tech: PropTypes.object,
  currentUser: PropTypes.object,
  claimTech: PropTypes.func.isRequired,
  unclaimTech: PropTypes.func.isRequired,
  getManagers: PropTypes.func.isRequired,
}

export default compose(
  connect(state => ({
    cid: state.techs.selectedTechId,
  })),
  graphql(findManagersQuery, {
    props: ({ mutate }) => ({ getManagers: techId => mutate({ variables: { techId } }) }),
  }),
  graphql(techQuery, {
    options: props => {
      const { cid } = props
      return {
        fetchPolicy: 'cache-and-network',
        variables: { cid },
      }
    },
    props: ({ data }) => data,
  }),
  graphql(claimTech, {
    props: ({ mutate }) => ({
      claimTech: ({ cid }) => mutate({ variables: { cid } }),
    }),
  }),
  graphql(unclaimTech, {
    props: ({ mutate }) => ({
      unclaimTech: ({ cid }) => mutate({ variables: { cid } }),
    }),
  }),
  graphql(CURRENT_USER_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { currentUser } }) {
      return { currentUser }
    },
  })
)(Tech)
