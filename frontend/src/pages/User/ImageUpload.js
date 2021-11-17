import React, { Component } from 'react';
import { Button,  Dialog, DialogActions,  DialogTitle, DialogContent, TableBody, Table, TableContainer, TableHead, TableRow, TableCell } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
const axios = require('axios');

export default class ImageUpload extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openImageModal: false,
      openImageEditModal: false,
      id: '',
      file: '',
      fileName: '',
      page: 1,
      images: [],
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
      });
    }
  }

  getImage = () => {
    this.setState({ loading: true });
    let data = '?';
    data = `${data}page=${this.state.page}`;
 
    axios.get(`http://localhost:8080/get-image${data}`, {
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

  deleteImage = (id) => {
    axios.post('http://localhost:8080/delete-image', { id: id}, {
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
      this.getImage();
    });
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
  };

  addImage = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('file', fileInput.files[0]);

    axios.post('http://localhost:8080/add-image', file, {
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

      this.handleImageClose();
      this.setState({ file: null, page: 1 }, () => {
        this.getImage();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleImageClose();
    });
  }

  updateImage = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('file', fileInput.files[0]);

    axios.post('http://localhost:8080/update-image', file, {
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

      this.handleImageEditClose();
      this.setState({ file: null }, () => {
        this.getImage();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleImageEditClose();
    });
  }

  handleImageOpen = () => {
    this.setState({
      openImageModal: true,
      id: '',
      fileName: ''
    });
  };

  handleImageClose = () => {
    this.setState({ openImageModal: false });
  };

  handleImageEditOpen = (data) => {
    this.setState({
      openImageEditModal: true,
      id: data._id,
      fileName: data.image
    });
  };

  handleImageEditClose = () => {
    this.setState({ openImageEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading }
        <div>
          <h2>Image Management</h2>
          <Link
            className="btn btn-info"
            onClick={this.handleImageOpen}
          >
            Add Image
          </Link>
        </div>

        {/* Edit Image */}
        <Dialog
          open={this.state.openImageEditModal}
          onClose={this.handleImageClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit Image</DialogTitle>
          <DialogContent>
           
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                id="standard-basic"
                type="file"
                accept="image/*"
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
            <Link onClick={this.handleImageEditClose} className="btn btn-primary">
              Cancel
            </Link>
            <Link
              onClick={(e) => this.updateImage()} className="btn btn-info">
              Edit Image
            </Link>
          </DialogActions>
        </Dialog>

        {/* Add Image */}
        <Dialog
          open={this.state.openImageModal}
          onClose={this.handleImageClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Image</DialogTitle>
          <DialogContent>
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                id="standard-basic"
                type="file"
                accept="image/*"
                inputProps={{
                  accept: "image/*"
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
            <Link onClick={this.handleImageClose} className="btn btn-primary">
              Cancel
            </Link>
            <Link
              onClick={(e) => this.addImage()} className="btn btn-success" color="primary" autoFocus>
              Add image
            </Link>
          </DialogActions>
        </Dialog>
        <br />

        <TableContainer>
         
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center"><b>Image</b></TableCell>
                <TableCell align="center"><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.images.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="center">
                    <img src={`http://localhost:8080/${row.image}`} width="100" height="100" controls autoPlay={true}/>
                  </TableCell>
                  <TableCell align="center">
                    <Link
                      className="btn btn-info"
                      onClick={(e) => this.handleImageEditOpen(row)}
                    >
                      Edit
                  </Link> &nbsp;  
                    <Link
                      className="btn btn-danger"
                      onClick={(e) => this.deleteImage(row._id)}
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