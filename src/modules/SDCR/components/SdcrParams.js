//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'reactstrap'

import DateRangePicker from './DateRangePicker'

class SdcrParams extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Form inline>
        <DateRangePicker
          onChange={d => {
            this.setState(d)
          }}
        />
      </Form>
    )
  }
}

SdcrParams.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default SdcrParams
