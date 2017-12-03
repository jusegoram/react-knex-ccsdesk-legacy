//CCS_UNIQUE EXJZ2DC6TSB
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ListGroup, ListGroupItem } from 'reactstrap'
import namecase from 'namecase'

class TechList extends React.Component {
  render() {
    const techs = this.props.techs
    return (
      <ListGroup>
        {techs.map(({ id, employee_id, first_name, last_name }) => (
          <ListGroupItem key={id} className="d-flex justify-content-between">
            <Link to={`/tech/${id}`}>
              ({employee_id}) {namecase(first_name + ' ' + last_name)}
            </Link>
          </ListGroupItem>
        ))}
      </ListGroup>
    )
  }
}

TechList.propTypes = {
  techs: PropTypes.arrayOf(PropTypes.object),
}

export default TechList
