import React, { Component } from 'react';
import { Button,  Dialog, DialogActions,  DialogTitle, DialogContent, TableBody, Table, TableContainer, TableHead, TableRow, TableCell } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
const axios = require('axios');

export default class VideoUpload extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openVideoModal: false,
      openVideoEditModal: false,
      id: '',
      file: '',
      fileName: '',
      page: 1,
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
        this.getVideo();
      });
    }
  }

  getVideo = () => {
    this.setState({ loading: true });
    let data = '?';
    data = `${data}page=${this.state.page}`;
 
    axios.get(`http://localhost:8080/get-video${data}`, {
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

  deleteVideo = (id) => {
    axios.post('http://localhost:8080/delete-video', { id: id}, {
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
      this.getVideo();
    });
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
  };

  addVideo = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('file', fileInput.files[0]);

    axios.post('http://localhost:8080/add-video', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleVideoClose();
      this.setState({ file: null, page: 1 }, () => {
        this.getVideo();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleVideoClose();
    });
  }

  updateVideo = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('file', fileInput.files[0]);

    axios.post('http://localhost:8080/update-video', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleVideoEditClose();
      this.setState({ file: null }, () => {
        this.getVideo();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleVideoEditClose();
    });
  }

  handleVideoOpen = () => {
    this.setState({
      openVideoModal: true,
      id: '',
      fileName: ''
    });
  };

  handleVideoClose = () => {
    this.setState({ openVideoModal: false });
  };

  handleVideoEditOpen = (data) => {
    this.setState({
      openVideoEditModal: true,
      id: data._id,
      fileName: data.video
    });
  };

  handleVideoEditClose = () => {
    this.setState({ openVideoEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading }
        <div>
          <h2>Video Management</h2>
          <Link
            className="btn btn-info"
            onClick={this.handleVideoOpen}
          >
            Add Video
          </Link>
        </div>

        {/* Edit Video */}
        <Dialog
          open={this.state.openVideoEditModal}
          onClose={this.handleVideoClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit Video</DialogTitle>
          <DialogContent>
           
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                id="standard-basic"
                type="file"
                accept="video/*"
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Link onClick={this.handleVideoEditClose} className="btn btn-primary">
              Cancel
            </Link>
            <Link
              onClick={(e) => this.updateVideo()} className="btn btn-info">
              Edit Video
            </Link>
          </DialogActions>
        </Dialog>

        {/* Add Video */}
        <Dialog
          open={this.state.openVideoModal}
          onClose={this.handleVideoClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Video</DialogTitle>
          <DialogContent>
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                id="standard-basic"
                type="file"
                accept="video/*"
                inputProps={{
                  accept: "video/*"
                }}
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
                required
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Link onClick={this.handleVideoClose} className="btn btn-primary">
              Cancel
            </Link>
            <Link
              onClick={(e) => this.addVideo()} className="btn btn-success" color="primary" autoFocus>
              Add Video
            </Link>
          </DialogActions>
        </Dialog>
        <br />

        <TableContainer>
         
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center"><b>Video</b></TableCell>
                <TableCell align="center"><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.videos.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="center">
                    <video src={`http://localhost:8080/${row.video}`} width="300" height="150" controls autoPlay={true}/>
                  </TableCell>
                  <TableCell align="center">
                    <Link
                      className="btn btn-info"
                      onClick={(e) => this.handleVideoEditOpen(row)}
                    >
                      Edit
                  </Link> &nbsp;
                    <Link
                      className="btn btn-danger"
                      onClick={(e) => this.deleteVideo(row._id)}
                    >
                      Delete
                  </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>
      </div>
    );
  }
}