import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UserForm = ({ values, status, touched, errors }) => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (status) {
      status && setUser([...user, status]);
    }
  }, [status]);
  return (
    <div>
      <Form>
        <label name="name">
          Enter your name:
          <Field type="text" name="name" placeholder="Name" />
          {touched.name && errors.name && (
            <p className="error-text">{errors.name}</p>
          )}
        </label>
        <label name="email">
          Enter your email:
          <Field type="email" name="email" placeholder="Email" />
          {touched.email && errors.email && (
            <p className="error-text">{errors.email}</p>
          )}
        </label>
        <label name="password">
          Enter your password:
          <Field type="password" name="password" placeholder="Password" />
          {touched.password && errors.password && (
            <p className="error-text">{errors.password}</p>
          )}
        </label>

        <label name="terms">
          Do you accept our <a href="/">Terms of Service</a>?
          <Field type="checkbox" name="terms" checked={values.terms} />
          {touched.terms && errors.terms && (
            <p className="error-text">{errors.terms}</p>
          )}
        </label>

        <button type="submit">Submit</button>
      </Form>

      {user.map(id => (
        <div key={Date.now()}>
          <h2>New user created with credentials:</h2>
          <p>{id.name}</p>
          <p>{id.email}</p>
          <p>{id.password}</p>
        </div>
      ))}
    </div>
  );
};

const FormikUserForm = withFormik({
  mapPropsToValues({ name, email, password, terms }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      terms: terms || false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Your name is required."),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Email is required."),
    terms: Yup.boolean().oneOf([true], "Must Accept Terms and Conditions"),
    password: Yup.string()
      .required("A password is required")
      .min(6, "Your password must be 6 characters or more")
      .matches(
        /^(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*\d.*)[a-zA-Z\d]{6,}$/,
        "Your password sucks"
      )
  }),
  handleSubmit(values, { setStatus, resetForm }) {
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        setStatus(res.data);
        resetForm("");
      })
      .catch(err => {
        console.error("Something is wrong", err);
      });
  }
})(UserForm);
export default FormikUserForm;
