import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { Link } from 'react-router-dom';
import { Routes } from "../routes";
import { Col, Row, Card, Container } from '@themesberg/react-bootstrap';
import BgImage from "../assets/img/illustrations/signin.svg";

import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const Register = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
              error.message ||
              error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <main>
    <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
      <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Create an account</h3>
                </div>
          <Form onSubmit={handleRegister} ref={form} className="mt-4">
          {!successful && (
            <div>
              <div className="mt-4">
                <label htmlFor="username">Username</label>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  placeholder="Enter Username"
                  onChange={onChangeUsername}
                  validations={[required, vusername]}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  placeholder="Enter Email"
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  placeholder="Enter Password"
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>

              <div className="mt-4">
                <button className="btn btn-primary btn-block">Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-4">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
        <div className="d-flex justify-content-center align-items-center mt-4">
          <span className="fw-normal">
            Already have an account?
            <Card.Link as={Link} to={Routes.Signin.path} className="fw-bold">
              {` Login here `}
            </Card.Link>
          </span>
        </div>
        </div>

        </Col>
        </Row>
        </Container>
        </section>
    </main>
  );
};

export default Register;
