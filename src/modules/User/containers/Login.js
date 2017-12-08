//CCS_UNIQUE RW9WOL1TCNO
/* eslint-disable no-undef */
// React
import React from 'react'
import PropTypes from 'prop-types'
import decode from 'jwt-decode'
// Apollo
import { graphql, compose } from 'react-apollo'
import { Provider } from 'rebass'
// Components
import LoginView from '../components/LoginView'

import LOGIN from '../queries/Login.graphql'
import CURRENT_USER_QUERY from '../../util/queries/CurrentUserQuery.graphql'

class Login extends React.Component {
  render() {
    const { currentUserLoading, currentUser } = this.props
    if (!currentUserLoading && currentUser) {
      const { history } = this.props
      const { company, hsp } = currentUser
      if (company || hsp) {
        history.push('/routelogs')
      } else {
        history.push('/techs')
      }
      return null
    }
    return (
      <Provider>
        <LoginView {...this.props} />
      </Provider>
    )
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  currentUserLoading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
}

const LoginWithApollo = compose(
  graphql(CURRENT_USER_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { loading, currentUser } }) {
      return { currentUserLoading: loading, currentUser }
    },
  }),
  graphql(LOGIN, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      login: async ({ email, password }) => {
        try {
          const { data: { login } } = await mutate({
            variables: { input: { email, password } },
          })

          if (login.errors) {
            return { errors: login.errors }
          }

          const { token, refreshToken } = login.tokens
          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', refreshToken)

          const { user: { company, hsp /*, isAdmin*/ } } = decode(token)
          if (history) {
            if (company || hsp) {
              return history.push('/routelogs')
            } else {
              return history.push('/techs')
            }
          }
          if (navigation) {
            return navigation.goBack()
          }
        } catch (e) {
          console.log(e.graphQLErrors) //eslint-disable-line no-console
        }
      },
    }),
  })
)(Login)

export default LoginWithApollo
