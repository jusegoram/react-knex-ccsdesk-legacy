//CCS_UNIQUE HS51IY2U764
// Web only component

// React
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import r from 'rebass'
import RegisterForm from '../components/RegisterForm'

class RegisterView extends React.PureComponent {
  state = {
    errors: [],
  }

  onSubmit = async values => {
    const { register } = this.props
    const result = await register(values)

    if (result.errors) {
      this.setState({ errors: result.errors })
    }
  }

  render() {
    return (
      <r.Fixed w={1} style={{ height: '100%', overflowY: 'scroll' }} bg="blue">
        <Helmet title="CCS Desk - Register" />
        <r.Flex style={{ height: '100%' }}>
          <r.Measure w={[null, 2 / 3, 1 / 3]} m="auto" style={{ minWidth: 300 }}>
            <r.Card p={20}>
              <r.Heading mb={10} style={{ fontWeight: 300 }} align="center">
                REGISTER
              </r.Heading>
              <RegisterForm onSubmit={this.onSubmit} errors={this.state.errors} />
            </r.Card>
          </r.Measure>
        </r.Flex>
      </r.Fixed>
    )
  }
}

RegisterView.propTypes = {
  register: PropTypes.func.isRequired,
}

export default RegisterView
