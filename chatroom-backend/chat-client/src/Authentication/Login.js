import React, { Component } from 'react';
import axios from 'axios';
// import logo from './logo.svg';
// import App from './App';
import './Login.css';
import {Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, Button, Alert} from 'react-bootstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
    if (this.state.username === '') {
      this.setState({error: "Please fill in your username."});
    } else if (this.state.password === '') {
      this.setState({error: "Please fill in your password."});
    } else {
      // Send API
      axios.post('/api/login', {
        username: this.state.username,
        password: this.state.password
      })
      .then((response) => {
        console.log(response);
        if (response.data.err) {
          this.setState({error: response.data.err});
        } else {
          this.setState({error: ""});
          this.props.setLogin(true, response.data.username, response.data.displayName, response.data.chatroomList);
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
      <div className="Login">
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={12}>
              <h1 className="header">Sign In to Your Account</h1>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12} md={6} mdPush={3}>
              <Form horizontal onSubmit={this.handleSubmit}>
                <FormGroup controlId="formHorizontalUsername">
                  <Col componentClass={ControlLabel} sm={2}>
                    Username
                  </Col>
                  <Col sm={10}>
                    <FormControl type="text" placeholder="Username" name="username" onChange={this.handleInputChange} value={this.state.username}/>
                  </Col>
                </FormGroup>
                <FormGroup controlId="formHorizontalPassword">
                  <Col componentClass={ControlLabel} sm={2}>
                  Password
                  </Col>
                  <Col sm={10}>
                    <FormControl type="password" placeholder="Password" name="password" onChange={this.handleInputChange} value={this.state.password}/>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col smOffset={2} sm={10}>
                    <Button type="submit" bsStyle="primary" block>Sign In</Button>
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

export default Login;

// <input type="text" name="username" onChange={this.handleInputChange.bind(this)} value={this.state.username} placeholder="Username" /><br/>
//               <input type="password" name="password" onChange={this.handleInputChange.bind(this)} value={this.state.password} placeholder="Password" /><br/>
//               <input type="submit" value="Sign In" />
