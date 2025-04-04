//CCS_UNIQUE ON1WDYCJ2X
import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap'
import r from 'rebass'

const required = value => (value ? undefined : 'Required')

const renderField = ({ input, label, type, meta: { touched, error } }) => {
  let color = 'normal'
  if (touched && error) {
    color = 'danger'
  }

  return (
    <FormGroup color={color}>
      <Label>{label}</Label>
      {touched &&
        (error && (
          <span>
            &nbsp;&nbsp;-&nbsp;&nbsp;<small>({error})</small>
          </span>
        ))}
      <div>
        <Input {...input} placeholder={label} type={type} />
      </div>
    </FormGroup>
  )
}

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
}

const LoginForm = ({ handleSubmit, submitting, onSubmit, errors }) => {
  return (
    <Form name="login" onSubmit={handleSubmit(onSubmit)}>
      <Field name="email" component={renderField} type="email" label="Email" validate={required} />
      <Field name="password" component={renderField} type="password" label="Password" validate={required} />
      {errors && (
        <FormGroup color="danger">
          <FormFeedback>{errors.map(error => <li key={error.field}>{error.message}</li>)}</FormFeedback>
        </FormGroup>
      )}
      <r.Flex justify="space-around">
        <Button color="primary" type="submit" disabled={submitting}>
          Login
        </Button>
      </r.Flex>
    </Form>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  errors: PropTypes.array,
}

export default reduxForm({
  form: 'login',
})(LoginForm)
