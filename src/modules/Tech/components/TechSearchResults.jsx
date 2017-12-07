//CCS_UNIQUE SBJE0MZE5SG
import React from 'react'
import PropTypes from 'prop-types'
import { Container, Table, Input } from 'reactstrap'
import { connect } from 'react-redux'

const TechSearchResults = ({ searchResults }) => (
  <Container
    fluid
    style={{
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: 5,
      width: '100%',
      padding: 10,
      marginTop: 10,
    }}
  >
    <Table striped hover responsive size="sm">
      <thead>
        <tr>
          <th>First Name</th>
        </tr>
      </thead>
      <tbody>
        {techs.map(tech => (
          <tr key={tech.cid}>
            <td>{tech.firstName}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Container>
)

TechSearchResults.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default TechSearchResults
