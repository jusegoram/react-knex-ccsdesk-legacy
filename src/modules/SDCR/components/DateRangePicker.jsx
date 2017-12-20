//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import moment from 'moment'

class DateRangePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      start: moment().format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange(boundName) {
    return e => {
      this.setState({ [boundName]: e.target.value }, () => {
        this.props.onChange(this.state)
      })
    }
  }

  render() {
    const { start, end } = this.state
    return (
      <Form inline>
        <FormGroup>
          <Label for="exampleDate">Start</Label>
          <Input
            type="date"
            name="date"
            id="exampleDate"
            placeholder="date placeholder"
            value={start}
            onChange={this.onChange('start')}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleDate">End</Label>
          <Input
            type="date"
            name="date"
            id="exampleDate"
            placeholder="date placeholder"
            value={end}
            onChange={this.onChange('end')}
          />
        </FormGroup>
      </Form>
    )
  }
}

DateRangePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default DateRangePicker
