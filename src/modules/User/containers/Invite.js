//CCS_UNIQUE RW9WOL1TCNO
// React
import React from 'react'
import PropTypes from 'prop-types'
// Apollo
import { graphql, compose } from 'react-apollo'
import { Provider } from 'rebass'
// Components
import InviteView from '../components/InviteView'
import INVITE from '../queries/Invite.graphql'

class Invite extends React.Component {
  render() {
    return (
      <Provider>
        <InviteView {...this.props} />
      </Provider>
    )
  }
}

Invite.propTypes = {
  invite: PropTypes.func.isRequired,
}

const InviteWithApollo = compose(
  graphql(INVITE, {
    props: ({ mutate }) => ({
      invite: ({ email, name, role }) => mutate({ variables: { email, name, role } }),
    }),
  })
)(Invite)

export default InviteWithApollo
