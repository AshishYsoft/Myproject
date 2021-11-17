import React, { Component} from 'react';
import { LinearProgress, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
const axios = require('axios');

export default class adminBoard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      id: '',
      username: '',
      email: '',
      password: '',
      roles: '',
      status: '',
      confirmationCode: '',
      page: 1,
      users: [],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('user');
    if (!token) {
      this.props.history.push('/');
    } else {
      this.setState({ token: token }, () => {
        this.getUser();
      });
    }
  }

  getUser = () => {
    this.setState({ loading: true });
    let data = '?';
    data = `${data}page=${this.state.page}`;
    
    axios.get(`http://localhost:8080/get-user${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, users: res.data.users, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, users: [], pages: 0 }, () => {} );
    });
  }

  deleteUser = (id) => {
    axios.post('http://localhost:8080/delete-user', { id: id}, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getUser();
    });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => { 
      this.getUser();
    });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2 style={{textAlign: 'center' , color:"red", marginBottom: "30px" , marginTop: "30px"}} >User Management</h2>
        </div>

        <div className="table-wrapper">
          <Table style={{height: '100px', width: '100px', align: "center"}} >
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Username</strong></TableCell>
                <TableCell align="center"><strong>Email</strong></TableCell>
                <TableCell align="center"><strong>Password</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.users.map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="center">{row.password}</TableCell>
                  <TableCell align="center">{row.status}</TableCell>
                  <TableCell align="center">
                    <Link 
                      to = {'/edit/' + row._id } 
                      className="btn btn-info" >
                      Edit
                    </Link>
                    &nbsp;
                    <button
                      className="btn btn-danger"
                      onClick={(e) => this.deleteUser(row._id)} >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
      </div>
    );
  }
}