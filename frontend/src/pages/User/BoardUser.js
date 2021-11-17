import React, { Component } from 'react';
import { TableBody, Table, TableContainer, TableHead, TableRow, TableCell } from '@material-ui/core';
import swal from 'sweetalert';
import LazyLoad from 'react-lazyload';

const axios = require('axios');

export default class BoardUser extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      id: '',
      file: '',
      fileName: '',
      page: 1,
      images: [],
      videos: [],
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
        this.getImage();
        this.getVideo();
      });
    }
  }

  getImage = () => {
    this.setState({ loading: true });
    let data = '?';
    data = `${data}page=${this.state.page}`;
 
    axios.get(`http://localhost:8080/get-images${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, images: res.data.images, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, images: [], pages: 0 },()=>{});
    });
  }

  getVideo = () => {
    this.setState({ loading: true });
    let data = '?';
    data = `${data}page=${this.state.page}`;
 
    axios.get(`http://localhost:8080/get-videos${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, videos: res.data.videos, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, videos: [], pages: 0 },()=>{});
    });
  }

  render() {
    return (
      <div>
        {this.state.loading }
        <div>
          <h2>User Timeline</h2>
        </div>

        <TableContainer>
        <div className="table-wrapper">
        <Table striped bordered hover>
        <TableHead>
        <TableRow>
          <TableCell align="center"><strong>Image</strong></TableCell> 
          </TableRow>       
          </TableHead>
        <TableBody>
        {this.state.images.length > 0 ? (
          this.state.images.map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center">
              <LazyLoad
                debounce={true}
                throttle={250}
                offset={50}
              >
              <img src={`http://localhost:8080/${row.image}`} alt="" height="100px" width="100px"/>
              </LazyLoad>
              </TableCell>
            </TableRow>
            )) 
          ) : (
        <TableRow>No Record Found</TableRow>
        )}
          </TableBody>
        </Table>
    </div>
    
    <div className="table-wrapper">
      <Table striped bordered hover>
      <TableHead>
      <TableRow>
        <TableCell align="center"><strong>Video</strong></TableCell> 
        </TableRow>       
        </TableHead>
        <TableBody>
        {this.state.videos.length > 0 ? (
          this.state.videos.map((row) => (
            <TableRow key={row.name}>
              <TableCell align="center">
              <LazyLoad
                debounce={true}
                throttle={250}
                offset={50}
              >
              <video src={`http://localhost:8080/${row.video}`} width="300px" height="150px" controls autoPlay={true}/>
              </LazyLoad>
              </TableCell>
            </TableRow>
          )) 
        ) : ( <TableRow>No Record Found</TableRow>
      )}
        </TableBody>
        </Table>  
        </div>    
     
          <br />
        </TableContainer>
      </div>
    );
  }
}