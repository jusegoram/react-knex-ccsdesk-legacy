//CCS_UNIQUE DATQDGZY4K
// Web only component

// React
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import ResetPasswordForm from '../components/ResetPasswordForm'

class ResetPasswordView extends React.Component {
  state = {
    errors: [],
  }

  onSubmit = resetPassword => async values => {
    const result = await resetPassword({
      ...values,
      token: this.props.match.params.token,
    })

    if (result.errors) {
      this.setState({ errors: result.errors })
      return
    }
  }

  render() {
    const { resetPassword } = this.props

    const renderMetaData = () => (
      <Helmet
        title="Reset Password"
        meta={[
          {
            name: 'description',
            content: 'Reset password page',
          },
        ]}
      />
    )

    return (
      <div>
        {renderMetaData()}
        <h1>Reset password!</h1>
        <ResetPasswordForm onSubmit={this.onSubmit(resetPassword)} errors={this.state.errors} />
      </div>
    )
  }
}

ResetPasswordView.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default ResetPasswordView
