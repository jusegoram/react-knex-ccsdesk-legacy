//CCS_UNIQUE WLJ95V5NC1J
import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap'
import r from 'rebass'

const required = value => (value ? undefined : 'Required')
const renderField = ({ input, label, children, type, meta: { touched, error } }) => {
  let color = 'normal'
  if (touched && error) {
    color = 'danger'
  }
  return (
    <FormGroup color={color}>
      <Label>{label}</Label>
      <div>
        <Input {...input} placeholder={label} type={type}>
          {children}
        </Input>
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </div>
    </FormGroup>
  )
}

renderField.propTypes = {
  input: PropTypes.object,
  children: PropTypes.array,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
}

const InviteForm = ({ handleSubmit, submitting, onSubmit, inviteErrors, loading, currentUser }) => {
  if (loading) {
    return (
      <div
        style={{
          height: '100%',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          borderRadius: 5,
          padding: 20,
        }}
      >
        Loading...
      </div>
    )
  }
  return (
    <div
      style={{
        height: '100%',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 20,
      }}
    >
      <Form name="invite" onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>Company</Label>
          <div>
            <Input value={currentUser.company} readOnly />
          </div>
        </FormGroup>
        <Field name="name" component={renderField} type="text" label="First Name" validate={required} />
        <Field name="email" component={renderField} type="email" label="Email" validate={required} />
        <Field name="role" component={renderField} type="select" label="Role">
          <option />
          <option value="Supervisor">Supervisor</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </Field>
        {inviteErrors && (
          <FormGroup color="danger">
            <FormFeedback>{inviteErrors.map(error => <p key={error.message}>{error.message}</p>)}</FormFeedback>
          </FormGroup>
        )}
        <r.Flex justify="space-around">
          <Button color="primary" type="submit" disabled={submitting}>
            Send Invite
          </Button>
        </r.Flex>
      </Form>
    </div>
  )
}

InviteForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  inviteErrors: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
}

export default reduxForm({ form: 'invite' })(InviteForm)
