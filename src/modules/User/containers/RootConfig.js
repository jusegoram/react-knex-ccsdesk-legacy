//CCS_UNIQUE PWIVMKUARG
/*eslint-disable no-unused-vars*/
// React
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'reactstrap'

// Apollo
import { graphql, compose } from 'react-apollo'

// Components
import ProfileView from '../components/ProfileView'

import CURRENT_USER_QUERY from '../../util/queries/CurrentUserQuery.graphql'
import COMPANIES_QUERY from '../../util/queries/CompaniesQuery.graphql'
import SET_COMPANY from '../../util/queries/SetCompanyMutation.graphql'
import LOGOUT from '../../util/queries/Logout.graphql'

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { loading, currentUser, companies, history, setCompany, logout } = this.props
    if (loading) return <div>Loading...</div>
    if (!currentUser || [4, 6].indexOf(currentUser.id) === -1) {
      history.push('/')
      return null
    }
    if (!this.state.newCompany) {
      this.setState({ newCompany: currentUser.company })
    }
    return (
      <Form style={{ width: 300, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
        <Input
          type="select"
          value={this.state.newCompany}
          onChange={e => {
            this.setState({ newCompany: e.target.value })
          }}
          style={{ margin: 20 }}
        >
          <option />
          {companies && companies.map(c => <option key={c}>{c}</option>)}
        </Input>
        <Button
          color="danger"
          onClick={e =>
            setCompany({ company: this.state.newCompany })
            .then(async () => {
              alert('Company changed. Log back in to refresh tokens.')
              await logout()
            })
            .catch(() => alert('something went wrong'))}
        >
          Change
        </Button>
      </Form>
    )
  }
}

Profile.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  companies: PropTypes.array,
  history: PropTypes.object.isRequired,
  setCompany: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
}

export default compose(
  graphql(SET_COMPANY, {
    props: ({ mutate }) => ({
      setCompany: ({ company }) => mutate({ variables: { company } }),
    }),
  }),
  graphql(COMPANIES_QUERY, {
    props({ data: { companies } }) {
      return { companies }
    },
  }),
  graphql(CURRENT_USER_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { loading, currentUser } }) {
      return { loading, currentUser }
    },
  }),
  graphql(LOGOUT, {
    // eslint-disable-next-line
    props: ({ ownProps: { client, history }, mutate }) => ({
      logout: async () => {
        const { data: { logout } } = await mutate()

        if (logout.errors) {
          return { errors: logout.errors }
        }

        // comment out until https://github.com/apollographql/apollo-client/issues/1186 is fixed
        //await client.resetStore();

        window.localStorage.setItem('token', null)
        window.localStorage.setItem('refreshToken', null)

        return history.push('/')
      },
    }),
  })
)(Profile)
