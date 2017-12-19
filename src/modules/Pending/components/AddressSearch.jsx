//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import { Card, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { identity } from 'lodash'

class AddressSearch extends React.Component {
  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    this.state = {
      address: props.address,
      radius: props.radius,
    }
  }
  update(key, map = identity) {
    return e => {
      this.setState({ [key]: map(e.target.value) })
    }
  }
  render() {
    const { onSubmit } = this.props
    return (
      <Card>
        <Form inline className="p-2 w-100">
          <FormGroup className="mr-2 mb-sm-1">
            <Label for="address" className="mr-sm-2">
              Address
            </Label>
            <Input
              type="text"
              name="address"
              id="address"
              placeholder="123 Main Street, 55555"
              onChange={this.update('address')}
            />
          </FormGroup>
          <FormGroup className="mr-2 mb-sm-1">
            <Label for="radius" className="mr-sm-2">
              Search Radius (mi)
            </Label>
            <Input type="number" name="radius" id="radius" onChange={this.update('radius', parseFloat)} />
          </FormGroup>
          <Button
            className="mb-sm-1"
            onClick={e => {
              onSubmit(this.state)
            }}
          >
            Search
          </Button>
        </Form>
      </Card>
    )
  }
}

AddressSearch.propTypes = {
  address: PropTypes.string,
  radius: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
}

export default AddressSearch
