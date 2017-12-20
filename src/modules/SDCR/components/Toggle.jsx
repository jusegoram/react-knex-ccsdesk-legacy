//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import { ButtonGroup, Button } from 'reactstrap'
import _ from 'lodash'

class DateRangePicker extends React.Component {
  render() {
    const { options, onChange, selected } = this.props
    return (
      <ButtonGroup style={{ margin: 3 }}>
        {options.map(option => {
          const { name, value, disabled } = option
          return (
            <Button
              key={value}
              active={option.value === selected}
              onClick={() => {
                onChange && onChange(option.value)
              }}
              disabled={disabled}
            >
              {name}
            </Button>
          )
        })}
      </ButtonGroup>
    )
  }
}

DateRangePicker.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  selected: PropTypes.any,
  onChange: PropTypes.func,
}

export default DateRangePicker
