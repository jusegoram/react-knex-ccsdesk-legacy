//CCS_UNIQUE 3H6ZG7ZMSGM
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import Helmet from 'react-helmet'
import { Container, Table } from 'reactstrap'

import PageLayout from '../../util/components/PageLayout'

import getAllErrorCodes from '../queries/getAllErrorCodes.graphql'

class ErrorCodes extends React.Component {
  render() {
    const { loading, errorCodes } = this.props
    if (loading) {
      return (
        <PageLayout>
          <Helmet title="Loading..." />
          <h3>Loading...</h3>
        </PageLayout>
      )
    }

    return (
      <PageLayout>
        <Helmet title="Reference" />
        <Container>
          <Table striped hover bordered>
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Resolution</th>
              </tr>
            </thead>
            <tbody>
              {errorCodes.map(errorCode => (
                <tr>
                  <td>{errorCode.code}</td>
                  <td>{errorCode.description}</td>
                  <td>{errorCode.resolution}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </PageLayout>
    )
  }
}

ErrorCodes.propTypes = {
  loading: PropTypes.bool.isRequired,
  errorCodes: PropTypes.arrayOf(PropTypes.object),
}

export default compose(
  graphql(getAllErrorCodes, {
    props({ data: { loading, errorCodes } }) {
      return { loading, errorCodes }
    },
  })
)(ErrorCodes)
