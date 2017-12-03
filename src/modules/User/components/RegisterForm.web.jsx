//CCS_UNIQUE WLJ95V5NC1J
import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap'
import r from 'rebass'

const required = value => (value ? undefined : 'Required')

export const minLength = min => value => (value && value.length < min ? `Must be ${min} characters or more` : undefined)
export const minLength3 = minLength(3)
export const minLength5 = minLength(5)
export const minLength6 = minLength(6)
const phoneNumberError = 'Phone numbers must be written as 10 digits with no symbols'
export const phoneNumber = value => (/^[0-9]{10}$/.test(value || '') ? undefined : phoneNumberError)

const validate = values => {
  const errors = {}

  if (values.password && values.passwordConfirmation && values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match'
  }
  return errors
}

const renderField = ({ input, label, type, placeholder, meta: { touched, error } }) => {
  let color = 'normal'
  if (touched && error) {
    color = 'danger'
  }

  return (
    <FormGroup color={color}>
      <Label>{label}</Label>
      <div>
        <Input {...input} placeholder={placeholder || label} type={type} />
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </div>
    </FormGroup>
  )
}

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
}

const RegisterForm = ({ handleSubmit, submitting, onSubmit, errors }) => {
  return (
    <Form name="register" onSubmit={handleSubmit(onSubmit)}>
      <Field name="first_name" component={renderField} type="text" label="First Name" validate={required} />
      <Field name="last_name" component={renderField} type="text" label="Last Name" validate={required} />
      <Field name="tech_id" component={renderField} type="text" label="Siebel ID" validate={required} />
      <Field
        name="phone_number"
        placeholder="5555555555"
        component={renderField}
        type="text"
        label="Phone Number (numbers only)"
        validate={phoneNumber}
      />
      <Field
        name="password"
        component={renderField}
        type="password"
        label="Password"
        validate={[required, minLength6]}
      />
      <Field
        name="passwordConfirmation"
        component={renderField}
        type="password"
        label="Password Confirmation"
        validate={[required, minLength6]}
      />
      {errors && (
        <FormGroup color="danger">
          <FormFeedback>{errors.map(error => <li key={error.field}>{error.message}</li>)}</FormFeedback>
        </FormGroup>
      )}
      <r.Flex justify="space-around">
        <Button color="primary" type="submit" disabled={submitting}>
          Register
        </Button>
      </r.Flex>
    </Form>
  )
}

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  errors: PropTypes.array,
}

export default reduxForm({
  form: 'register',
  validate,
})(RegisterForm)
