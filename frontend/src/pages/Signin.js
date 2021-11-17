import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import '../App.css';
import { Link } from 'react-router-dom';
import { Routes } from "../routes";
import { Col, Row, Card, Container } from '@themesberg/react-bootstrap';
import BgImage from "../assets/img/illustrations/signin.svg";

import AuthService from "../services/auth-service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Login = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        () => {
          props.history.push("/user");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
              error.message ||
              error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
            <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
              <div className="text-center text-md-center mb-4 mt-md-0">
                <h3 className="mb-0">Sign in to our platform</h3>
              </div>

          <Form onSubmit={handleLogin} ref={form} className="mt-4">
            <div className="mt-4">
              <label htmlFor="username">Username</label>
              <Input
              type="text"
              className="form-control"
              name="username"
              value={username}
              placeholder="Enter Username"
              onChange={onChangeUsername}
              validations={[required]}
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
                validations={[required]}
              />
            </div>

            <div className="mt-4">
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal"></span>
                  </div>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="mt-4">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}

          <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>

              <div className="d-flex justify-content-center align-items-center mt-4">
              <span className="fw-normal">
                Not registered?
                <Card.Link as={Link} to={Routes.Signup.path} className="fw-bold">
                  {` Create account `}
                </Card.Link>
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
    </section>
  </main>
)};

export default Login;