//CCS_UNIQUE RW9WOL1TCNO
/* eslint-disable no-undef */
// React
import React from 'react'
import PropTypes from 'prop-types'
// Apollo
import { graphql, compose } from 'react-apollo'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import r from 'rebass'
import Helmet from 'react-helmet'
// Components

import FORGOT_PASSWORD from '../queries/ForgotPassword.graphql'

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = { email: '' }
    this.submit = this.submit.bind(this)
  }
  async submit() {
    this.setState({ submitting: true })
    await this.props.forgotPassword({ email: this.state.email })
    alert('If this email address is recongized, an email will be sent to your account with further instructions')
  }
  render() {
    const { email, submitting } = this.state
    return (
      <r.Provider>
        <r.Fixed w={1} style={{ height: '100%' }} bg="blue">
          <Helmet title="CCS Desk - Forgot Password" />
          <r.Flex style={{ height: '100%' }}>
            <r.Measure w={[null, 2 / 3, 1 / 3]} m="auto" style={{ minWidth: 300 }}>
              <r.Card p={20}>
                <r.Heading mb={10} style={{ fontWeight: 300 }} align="center">
                  FORGOT PASSWORD
                </r.Heading>
                <Form name="invite">
                  <FormGroup>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => {
                        this.setState({ email: e.target.value })
                      }}
                    />
                  </FormGroup>
                  <r.Flex justify="space-around">
                    <Button color="primary" onClick={this.submit} disabled={submitting}>
                      Send Reset Email
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

ForgotPassword.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
}

export default compose(
  graphql(FORGOT_PASSWORD, {
    props: ({ ownProps: { history }, mutate }) => ({
      forgotPassword: async ({ email }) => {
        try {
          const { data } = await mutate({
            variables: { email },
          })
          console.log('data', data)
          history.push('/')
        } catch (e) {
          console.log(e.graphQLErrors) //eslint-disable-line no-console
        }
      },
    }),
  })
)(ForgotPassword)
