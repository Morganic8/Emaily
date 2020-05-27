import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';

import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';

import formFields from './formFields'

class SurveyForm extends Component {

  //
  renderFields() {
    return formFields.map(({ label, name }) => {
      return <Field
        key={name}
        type="text"
        name={name}
        label={label}
        component={SurveyField}
      />
    })
  }
  render() {
    return (
      <div>
        {/*handle submit comes from redux form*/}
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>

        </form>
      </div>
    );
  }
}
function validate(values) {

  //"values" represents "name" survey fields and their respective values
  const errors = {};

  errors.recipients = validateEmails(values.recipients || '');

  formFields.forEach(({ name, noValueError }) => {
    if (!values[name]) {
      errors[name] = noValueError
    }
  })



  //If no errors reduxForm will return no errors
  return errors;
}

export default reduxForm({
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm);