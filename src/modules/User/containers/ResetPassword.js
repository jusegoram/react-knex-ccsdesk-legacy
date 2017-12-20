//CCS_UNIQUE RW9WOL1TCNO
/* eslint-disable no-undef */
// React
import React from 'react'
import PropTypes from 'prop-types'
// Apollo
import { graphql, compose } from 'react-apollo'
import { Form, FormGroup, Input, Button } from 'reactstrap'
import r from 'rebass'
import Helmet from 'react-helmet'
import queryString from 'query-string'
// Components

import RESET_PASSWORD from '../queries/ResetPassword.graphql'

class ResetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = { password: '', confirmPassword: '' }
    this.submit = this.submit.bind(this)
  }
  async submit() {
    const { password, confirmPassword } = this.state
    if (password !== confirmPassword) {
      alert('Password and Confirm Password must match')
      return
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }
    this.setState({ submitting: true })
    console.log('state', this.state)
    await this.props.resetPassword({ password })
    alert('Your password has been reset')
  }
  render() {
    const { password, confirmPassword, submitting } = this.state
    return (
      <r.Provider>
        <r.Fixed w={1} style={{ height: '100%' }} bg="blue">
          <Helmet title="CCS Desk - Reset Password" />
          <r.Flex style={{ height: '100%' }}>
            <r.Measure w={[null, 2 / 3, 1 / 3]} m="auto" style={{ minWidth: 300 }}>
              <r.Card p={20}>
                <r.Heading mb={10} style={{ fontWeight: 300 }} align="center">
                  RESET PASSWORD
                </r.Heading>
                <Form name="invite">
                  <FormGroup>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => {
                        this.setState({ password: e.target.value })
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={e => {
                        this.setState({ confirmPassword: e.target.value })
                      }}
                    />
                  </FormGroup>
                  <r.Flex justify="space-around">
                    <Button color="primary" onClick={this.submit} disabled={submitting}>
                      Reset Password
                    </Button>
                  </r.Flex>
                </Form>
              </r.Card>
            </r.Measure>
          </r.Flex>
        </r.Fixed>
      </r.Provider>
    )
  }
}

ResetPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
}

export default compose(
  graphql(RESET_PASSWORD, {
    props: ({ ownProps: { location, history }, mutate }) => ({
      resetPassword: async ({ password }) => {
        try {
          const { token } = queryString.parse(location.hash)
          const { data } = await mutate({
            variables: { token, password },
          })
          console.log('data', data)
          history.push('/')
        } catch (e) {
          console.log(e) //eslint-disable-line no-console
        }
      },
    }),
  })
)(ResetPassword)
