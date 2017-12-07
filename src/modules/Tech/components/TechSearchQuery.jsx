//CCS_UNIQUE SBJE0MZE5SG
import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col, FormGroup, Label, Input } from 'reactstrap'

const TechSearchPanel = ({ searchParams, onSearchParamChanged }) => (
  <Container
    fluid
    style={{
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: 5,
      width: '100%',
      padding: 10,
    }}
  >
    <Row>
      <Col xs="12" md="4" lg="3">
        <FormGroup>
          <Label>Siebel ID</Label>
          <Input
            type="text"
            placeholder="EXNY000001"
            value={searchParams.techId}
            onChange={e => {
              onSearchParamChanged({ techId: e.target.value })
            }}
          />
        </FormGroup>
      </Col>
      {/* <Col xs="12" md="4" lg="3">
            <FormGroup>
              <Label>DMAs</Label>
              <Input
                type="select"
                value={searchParams.dma || null}
                onChange={e => {
                  onQueryChanged({ techId: e.target.value })
                }}
              >
              </Input>
            </FormGroup>
          </Col> */}
    </Row>
  </Container>
)

TechSearchPanel.propTypes = {
  searchParams: PropTypes.object.isRequired,
  onSearchParamChanged: PropTypes.func.isRequired,
}

export default TechSearchPanel
