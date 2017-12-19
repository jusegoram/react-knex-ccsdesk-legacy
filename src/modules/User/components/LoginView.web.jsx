//CCS_UNIQUE IHRY05UR4MK
// Web only component

// React
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Container } from 'reactstrap'
import r from 'rebass'

import LoginForm from '../components/LoginForm'

class LoginView extends React.PureComponent {
  state = {
    errors: [],
  }

  onSubmit = login => async values => {
    const result = await login(values)

    if (result.errors) {
      this.setState({ errors: result.errors })
    }
  }

  render() {
    const { login } = this.props

    return (
      <r.Fixed w={1} style={{ height: '100%' }} bg="blue">
        <Helmet title="CCS Desk - Login" />
        <r.Flex style={{ height: '100%' }}>
          <r.Measure w={[null, 2 / 3, 1 / 3]} m="auto" style={{ minWidth: 300 }}>
            <r.Card p={20}>
              <r.Heading mb={10} style={{ fontWeight: 300 }} align="center">
                LOG IN
              </r.Heading>
              <LoginForm onSubmit={this.onSubmit(login)} errors={this.state.errors} />
              {/* <span style={{ width: '100%', textAlign: 'center', display: 'inline-block', marginTop: 20 }}>
                <a href="/forgot-password">Forgot Password?</a>
              </span> */}
            </r.Card>
          </r.Measure>
        </r.Flex>
      </r.Fixed>
    )
  }
}

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
  error: PropTypes.string,
}

export default LoginView
