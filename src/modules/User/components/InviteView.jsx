//CCS_UNIQUE IHRY05UR4MK
// Web only component

// React
import React from 'react'
import PropTypes from 'prop-types'
import r from 'rebass'
import InviteForm from '../components/InviteForm'
import PageLayout from '../../util/components/PageLayout'

class InviteView extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async onSubmit(values) {
    const { invite } = this.props
    try {
      await invite(values)
      // alert(values.name + ' has been sent an email inviting them to create an account on CCS Desk.')
    } catch (e) {
      this.setState({ errors: e.graphQLErrors })
    }
  }

  render() {
    return (
      <PageLayout>
        <r.Measure w={[null, 2 / 3, 1 / 3]} m="auto" style={{ minWidth: 300 }}>
          <InviteForm onSubmit={this.onSubmit.bind(this)} inviteErrors={this.state.errors} />
        </r.Measure>
      </PageLayout>
    )
  }
}

InviteView.propTypes = {
  invite: PropTypes.func.isRequired,
}

export default InviteView
