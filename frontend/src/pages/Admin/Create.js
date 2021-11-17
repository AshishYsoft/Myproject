import React, { Component } from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import axios from 'axios';
import { Redirect } from "react-router-dom";
import Select  from 'react-select';

const roles = [
    {
        value: '6165572743af525cf992fd50', 
        label: 'User', 
        _id: '6165572743af525cf992fd50'
    },{
        value: '6165572743af525cf992fd51', 
        label: 'Admin', 
        _id: '6165572743af525cf992fd51'
    },
]

export default class Create extends Component {
    constructor(props) {
        super(props);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRoles = this.onChangeRoles.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeConfirmationCode = this.onChangeConfirmationCode.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            email: '',
            password: '',
            status: '',
            roles: []
        }
    }

    onChangeUsername(e) {
        this.setState({ username: e.target.value })
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value })
    }

    onChangePassword(e) {
        this.setState({ password: e.target.value })
    }

    onChangeRoles(e) {
        this.setState({ roles: e.target.value })
    }

    onChangeStatus(e) {
        this.setState({ status: e.target.value })
    }

    onChangeConfirmationCode(e) {
        this.setState({ confirmationCode: e.target.value })
    }

    state = {
        redirect: false
    }

    onSubmit(e) {
        e.preventDefault();
        const dataObject = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            roles: this.state.roles,
            status: this.state.status,
        };
        console.log(dataObject);
        axios.post('http://localhost:8080/add-user', dataObject).then(() => this.setState({ redirect: true }));
        this.setState({ username: '', email: '', password: '', roles: '', status: '',confirmationCode: '' })
    }

    render() {
        const { redirect } = this.state;
        if (redirect) {
            return <Redirect to="/admin" />
        }
        return (
            <div className="form-wrapper">
                <h2 style={{textAlign: 'center' , color:"red", marginBottom: "30px" , marginTop: "30px"}} >Add New User</h2>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group controlId="Username">
                    <th>Username</th>
                    <Form.Control 
                        type="text" 
                        value={this.state.username} 
                        onChange={this.onChangeUsername} 
                        placeholder="Enter Username"
                        required
                    />
                    </Form.Group>
                    <Form.Group controlId="Email">
                    <th>Email</th>
                    <Form.Control 
                        type="email" 
                        value={this.state.email} 
                        onChange={this.onChangeEmail} 
                        placeholder="Enter Email"
                        required
                    />
                    </Form.Group>
                    <Form.Group controlId="Password">
                    <th>Password</th>
                    <Form.Control 
                        type="password" 
                        value={this.state.password} 
                        onChange={this.onChangePassword} 
                        placeholder="Enter Password"
                        required
                    />
                    </Form.Group>
                    <Form.Group controlId="Status">
                    <th>Status</th>
                    <Form.Control 
                        type="text" 
                        value={this.state.status} 
                        onChange={this.onChangeStatus} 
                        placeholder="Enter Status"
                        required
                    />
                    </Form.Group>
                    <Form.Group controlId="Role">
                    <th>Roles</th>
                        <Select options={roles} />
                    </Form.Group>
                    <br/>
                    <Button variant="primary" size="small" block="block" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}