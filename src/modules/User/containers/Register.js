//CCS_UNIQUE JZQ89G6UAP
// React
import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Provider } from 'rebass'

// Apollo
import { graphql, compose } from 'react-apollo'

// Components
import RegisterView from '../components/RegisterView'

import REGISTER from '../queries/Register.graphql'
import ValidateRegistrationToken from '../queries/ValidateRegistrationToken.graphql'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    const { validateToken } = this.props
    validateToken().then(({ email }) => {
      this.setState({ email })
    })
  }
  render() {
    const { email } = this.state
    return (
      email !== null &&
      email !== undefined && (
        <Provider>
          <RegisterView email={email} {...this.props} />
        </Provider>
      )
    )
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  validateToken: PropTypes.func.isRequired,
}

const RegisterWithApollo = compose(
  graphql(REGISTER, {
    props: ({ ownProps: { location, history }, mutate }) => ({
      register: async ({ first_name, last_name, tech_id, password, phone_number }) => {
        try {
          const { token } = queryString.parse(location.hash)
          const { data: { register } } = await mutate({
            variables: { input: { first_name, last_name, tech_id, password, token, phone_number } },
          })

          if (register.errors) {
            return { errors: register.errors }
          }
          if (history) {
            alert('You have successfully registered. Please log in to continue')
            return history.push('/')
          }
        } catch (e) {
          console.log(e.graphQLErrors)
        }
      },
    }),
  }),
  graphql(ValidateRegistrationToken, {
    props: ({ ownProps: { location }, mutate: validate }) => ({
      token: queryString.parse(location.hash).token,
      validateToken: async () => {
        const { token } = queryString.parse(location.hash)
        if (!token) return { token: false }
        const { data: { validateRegistrationToken: validationResult } } = await validate({ variables: { token } })
        return { email: validationResult }
      },
    }),
  })
)(Register)

export default RegisterWithApollo
