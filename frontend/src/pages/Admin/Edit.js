import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Redirect } from "react-router-dom";
const bcrypt = require("bcryptjs");

export default class Edit extends Component {
    constructor(props) {
        super(props)
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            email: '',
            password: '',
            status: '',
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8080/edit/' + this.props.match.params.id)
        .then(res => {
            this.setState({
                username: res.data.username,
                email: res.data.email,
                password: bcrypt.hashSync(res.data.password, 8),
                status: res.data.status
            });
        })
        .catch((error) => {
            console.log(error);
        })
    }

    state = {
        redirect: false
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

    onChangeStatus(e) {
        this.setState({ status: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault()

        const dataObject = {
            username: this.state.username,
            email: this.state.email,
            password: bcrypt.hashSync(this.state.password, 8),
            status: this.state.status
        };  

        axios.put('http://localhost:8080/update/' + this.props.match.params.id, dataObject).then((res) => {
            this.setState({ redirect: true })
            console.log(res.data);
            console.log('Update Data Success');
        }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/admin' />;
        }
        return (
            <div className="form-wrapper">
                <h2 style={{textAlign: 'center', color:"red", marginBottom: "30px" , marginTop: "30px"}} >Update User</h2>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group controlId="Username">
                    <th>Username</th>
                    <Form.Control 
                        type="text" 
                        value={this.state.username} 
                        onChange={this.onChangeUsername} 
                        required
                    />
                    </Form.Group>

                    <Form.Group controlId="Email">
                    <th>Email</th>
                    <Form.Control 
                        type="email" 
                        value={this.state.email} 
                        onChange={this.onChangeEmail} 
                        required
                    />
                    </Form.Group>

                    <Form.Group controlId="Password">
                    <th>Password</th>
                    <Form.Control 
                        type="password" 
                        value={this.state.password} 
                        onChange={this.onChangePassword}
                        required 
                    />
                    </Form.Group>

                    <Form.Group controlId="Status">
                    <th>Status</th>
                    <Form.Control 
                        type="text" 
                        value={this.state.status} 
                        onChange={this.onChangeStatus}
                        disabled
                        required 
                    />
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