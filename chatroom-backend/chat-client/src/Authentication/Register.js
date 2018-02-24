import React, { Component } from 'react';
import axios from 'axios';
// import logo from './logo.svg';
// import App from './App';
import './Register.css';
import {Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, Button, Alert} from 'react-bootstrap';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameReg: '',
      passwordReg: '',
      confirmPasswordReg: '',
      displayNameReg: '',
      error: ''
    }
    this.clearForm = this.clearForm.bind(this);
  }

  clearForm() {
    this.setState({
      usernameReg: '',
      passwordReg: '',
      confirmPasswordReg: '',
      displayNameReg: '',
      error: ''
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault(); 
    if ((this.state.usernameReg === '') || (this.state.passwordReg === '') || (this.state.confirmPasswordReg === '') || (this.state.displayNameReg === '')) {
      this.setState({error: "All fields are required."});
    } else if (this.state.passwordReg !== this.state.confirmPasswordReg) {
      this.setState({error: "The 2 password entries do not match."});
    } else {
      // Send API
      axios.post('/api/register', {
        username: this.state.usernameReg,
        password: this.state.passwordReg,
        displayName: this.state.displayNameReg
      })
      .then((response) => {
        console.log(response);
        if (response.data.err) {
          this.setState({error: response.data.err});
        } else {
          this.setState({error: ""});
          this.props.login();
          this.clearForm();
          this.props.setLogin(true, response.data.username, response.data.displayName, []);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  render() {
    let errorMessage = null;
    if (this.state.error) {
      errorMessage = <Alert bsStyle="danger"><p className="text-left">{this.state.error}</p></Alert>;
    }
    return(
      <div className="Register">
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={12}>
              <h1 className="header">Register for an Account and Start Chatting</h1>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12} md={6} mdPush={3}>
              <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                <FormGroup controlId="formHorizontalRegUsername">
                  <Col componentClass={ControlLabel} sm={2}>
                    Username
                  </Col>
                  <Col sm={10}>
                    <FormControl type="text" placeholder="Username" name="usernameReg" onChange={this.handleInputChange.bind(this)} value={this.state.usernameReg}/>
                  </Col>
                </FormGroup>
                <FormGroup controlId="formHorizontalRegDisplayName">
                  <Col componentClass={ControlLabel} sm={2}>
                    Display Name
                  </Col>
                  <Col sm={10}>
                    <FormControl type="text" placeholder="Display Name" name="displayNameReg" onChange={this.handleInputChange.bind(this)} value={this.state.displayNameReg}/>
                  </Col>
                </FormGroup>
                <FormGroup controlId="formHorizontalRegPassword">
                  <Col componentClass={ControlLabel} sm={2}>
                  Password
                  </Col>
                  <Col sm={10}>
                    <FormControl type="password" placeholder="Password" name="passwordReg" onChange={this.handleInputChange.bind(this)} value={this.state.passwordReg}/>
                  </Col>
                </FormGroup>
                <FormGroup controlId="formHorizontalRegConfirmPassword">
                  <Col componentClass={ControlLabel} sm={2}>
                  Re-enter Password
                  </Col>
                  <Col sm={10}>
                    <FormControl type="password" placeholder="Confirm Password" name="confirmPasswordReg" onChange={this.handleInputChange.bind(this)} value={this.state.confirmPasswordReg}/>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col smOffset={2} sm={10}>
                    <Button type="submit" bsStyle="primary" block>Register</Button>
                  </Col>
                </FormGroup>
              </Form>
              {errorMessage}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Register;
