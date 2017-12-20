//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import moment from 'moment'

class DateRangePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.defaultRange || {
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
      <Form inline style={{ position: 'absolute', right: 0 }}>
        <FormGroup>
          <Input type="date" placeholder="date placeholder" value={start} onChange={this.onChange('start')} />
        </FormGroup>
        <span style={{ color: 'white', fontSize: '20px' }}>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
        <FormGroup>
          <Input type="date" placeholder="date placeholder" value={end} onChange={this.onChange('end')} />
        </FormGroup>
      </Form>
    )
  }
}

DateRangePicker.propTypes = {
  defaultRange: PropTypes.object,
  onChange: PropTypes.func.isRequired,
}

export default DateRangePicker
