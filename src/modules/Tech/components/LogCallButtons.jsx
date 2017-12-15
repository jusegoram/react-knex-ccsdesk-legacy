//CCS_UNIQUE SBJE0MZE5SG
import React from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, Input, Button } from 'reactstrap'

class LogCallButtons extends React.Component {
  constructor(props) {
    super(props)

    this.setReason = this.setReason.bind(this)
    this.state = {
      reason: null,
    }
  }

  setReason(reason) {
    if (reason == 'null') reason = null
    this.setState({ reason })
  }

  logCallClicked(callback) {
    const { reason } = this.state
    if (!reason) {
      alert('Please select a reason for the call')
      return
    }
    callback({ reason })
  }

  render() {
    const { onLogCall, callDrivers } = this.props
    return (
      <Form inline>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Input
            size="sm"
            type="select"
            onChange={e => {
              this.setReason(e.target.value)
            }}
          >
            <option value="null">Select One</option>
            {callDrivers.map(callDriver => (
              <option key={callDriver} value={callDriver}>
                {callDriver}
              </option>
            ))}
          </Input>
        </FormGroup>
        <Button
          color="success"
          size="sm"
          onClick={() => {
            this.logCallClicked(onLogCall)
          }}
        >
          Log Call
        </Button>
      </Form>
    )
  }
}

LogCallButtons.propTypes = {
  onLogCall: PropTypes.func.isRequired,
  callDrivers: PropTypes.array.isRequired,
}

export default LogCallButtons
