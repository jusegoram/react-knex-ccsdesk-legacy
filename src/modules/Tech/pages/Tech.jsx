//CCS_UNIQUE E4YI2DOT2IC
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { Container, Row, Col, Table, Button } from 'reactstrap'
import namecase from 'namecase'

import PageLayout from '../../util/components/PageLayout'
import LogCallButtons from '../components/LogCallButtons'

import CURRENT_USER_QUERY from '../../util/queries/CurrentUserQuery.graphql'
import techQuery from '../queries/tech.graphql'
import claimTech from '../queries/claimTech.graphql'
import unclaimTech from '../queries/unclaimTech.graphql'
import findManagersQuery from '../queries/findManagersForWorker.graphql'
import logCallMutation from '../queries/logCall.graphql'
import callDriversQuery from '../queries/callDrivers.graphql'

const groupTypePriority = {
  COMPANY: 0,
  DMA: -2,
  OFFICE: -3,
  SERVICE_REGION: -4,
  TECH_TEAM: -5,
}

class Tech extends React.Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      dropdownOpen: false,
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    })
  }

  render() {
    const { loading } = this.props
    if (loading) {
      return (
        <PageLayout>
          <div style={{ flex: 1, backgroundColor: '#fff', lineHeight: '32px', fontSize: '32px', padding: 10 }}>
            Loading...
          </div>
        </PageLayout>
      )
    }
    const { currentUser, tech, claimTech, unclaimTech, callDrivers, logCall } = this.props

    if (!this.fetchingManagers) {
      this.fetchingManagers = true
      this.props.getManagers(tech.techId).then(data => {
        const managers = data.data.findManagersForWorker.map(m => JSON.parse(m))
        this.setState({ managers })
      })
    }
    const groupNames = JSON.parse(tech.groupNames)
    const techName = namecase(`${tech.firstName} ${tech.lastName}`)
    const techphone = tech.phoneNumber
    const formattedTechPhone = !techphone
      ? 'DNE'
      : `(${techphone.slice(0, 3)}) ${techphone.slice(3, 6)}-${techphone.slice(6, 10)}`

    const unsortedContactInfos = []
    if (this.state && this.state.managers) {
      this.state.managers.forEach(techManager => {
        const techGroups = techManager.techGroups
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
      <PageLayout>
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
                !currentUser.company &&
                !currentUser.hsp && (
                  <LogCallButtons
                    callDrivers={callDrivers}
                    onLogCall={async ({ reason }) => {
                      try {
                        await logCall({ cid: tech.cid, reason })
                        alert('This call has been recorded.')
                      } catch (e) {
                        console.log(e)
                        alert('An unexpected error occurred while recording this call')
                      }
                    }}
                  />
                )}
              {currentUser &&
                currentUser.company &&
                currentUser.techs.indexOf(tech.cid) === -1 && (
                  <Button
                    color="success"
                    size="sm"
                    onClick={async () => {
                      await claimTech({ cid: tech.cid })
                      this.props.refetchCurrentUser()
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
                    onClick={async () => {
                      await unclaimTech({ cid: tech.cid })
                      this.props.refetchCurrentUser()
                    }}
                  >
                    Unclaim Tech
                  </Button>
                )}
            </div>
          </div>
          <div style={{ flex: 1, paddingTop: 10, overflow: 'scroll' }}>
            <Container fluid style={{ margin: 0 }}>
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
                          <th>Tech&nbsp;ID</th>
                          <td>{tech.techId}</td>
                        </tr>
                        <tr>
                          <th>Phone&nbsp;Number</th>
                          <td>{formattedTechPhone}</td>
                        </tr>
                        <tr>
                          <th>Skills</th>
                          <td>{tech.skills}</td>
                        </tr>
                        <tr>
                          <th>Schedule</th>
                          <td>{tech.schedule}</td>
                        </tr>
                        <tr>
                          <th>Start&nbsp;LL</th>
                          <td>
                            {tech.startLocation && (
                              <a
                                target="_blank"
                                href={
                                  'https://www.google.com/maps/' +
                                  `@${tech.startLocation.latitude},${tech.startLocation.longitude},20z`
                                }
                              >
                                {tech.startLocation.latitude}, {tech.startLocation.longitude}
                              </a>
                            )}
                          </td>
                        </tr>
                        {_.toPairs(groupNames).map(pair => (
                          <tr key={pair[0] + pair[1]}>
                            <th>{pair[0]}</th>
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
                      <h4>Contacts (claimed)</h4>
                    </center>
                    <Table bordered striped>
                      <thead>
                        <tr>
                          <th>Contact</th>
                          <th>Role</th>
                          <th>Phone Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!tech.contacts && (
                          <tr>
                            <td colSpan={3}>Loading...</td>
                          </tr>
                        )}
                        {tech.contacts &&
                          tech.contacts.length === 0 && (
                            <tr>
                              <td colSpan={3}>No one has claimed this tech</td>
                            </tr>
                          )}
                        {tech.contacts &&
                          tech.contacts.length !== 0 &&
                          tech.contacts.map((
                            { id, firstName, lastName, role, phoneNumber } // techManager
                          ) => (
                            <tr key={id}>
                              <td>
                                {/* <Link to={`/manager/${techManager.id}`}> */}
                                {namecase(`${firstName} ${lastName}`)}
                                {/* </Link> */}
                              </td>
                              <td>{role}</td>
                              <td>{`(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(
                                6,
                                10
                              )}`}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                  {currentUser &&
                    !currentUser.role && (
                      <div style={{ minWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                        <center>
                          <h4>Contacts (fallback)</h4>
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
                    )}
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </PageLayout>
    )
  }
}

Tech.propTypes = {
  loading: PropTypes.bool.isRequired,
  tech: PropTypes.object,
  logCall: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  claimTech: PropTypes.func.isRequired,
  unclaimTech: PropTypes.func.isRequired,
  getManagers: PropTypes.func.isRequired,
  refetchCurrentUser: PropTypes.func.isRequired,
  callDrivers: PropTypes.array,
}

export default compose(
  graphql(findManagersQuery, {
    props: ({ mutate }) => ({ getManagers: techId => mutate({ variables: { techId } }) }),
  }),
  graphql(callDriversQuery, {
    props: ({ data: { callDrivers } }) => ({ callDrivers }),
  }),
  graphql(techQuery, {
    options: props => {
      const { match: { params: { cid: cid } } } = props
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
  graphql(logCallMutation, {
    props: ({ mutate }) => ({
      logCall: ({ cid, reason }) => mutate({ variables: { cid, reason } }),
    }),
  }),
  graphql(CURRENT_USER_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { currentUser, refetch: refetchCurrentUser } }) {
      return { currentUser, refetchCurrentUser }
    },
  })
)(Tech)
