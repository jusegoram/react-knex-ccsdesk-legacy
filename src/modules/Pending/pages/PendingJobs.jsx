//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import Helmet from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'

import PageLayout from '../../util/components/PageLayout'
import AddressSearch from '../components/AddressSearch'
import PendingJobsList from '../containers/PendingJobsList'

class PendingJobs extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: null }
    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit(query) {
    this.setState(query)
  }
  render() {
    const { address, radius } = this.state
    return (
      <PageLayout>
        <Helmet title="CCS Desk - Routelog Explorer" />
        <Container fluid>
          <Row>
            <Col>
              <AddressSearch address={address} radius={radius} onSubmit={this.onSubmit} />
            </Col>
          </Row>
          {address &&
            radius && (
              <Row className="mt-2">
                <Col>
                  <PendingJobsList address={address} radius={radius} />
                </Col>
              </Row>
            )}
        </Container>
      </PageLayout>
    )
  }
}

export default PendingJobs
