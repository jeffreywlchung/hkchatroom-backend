import React, { Component } from 'react';
import axios from 'axios';
// import logo from './logo.svg';
// import App from './App';
import './CreateChatroom.css';
import {Col, Row, Form, FormGroup, ControlLabel, FormControl, Button, Alert} from 'react-bootstrap';

class CreateChatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatroomName: '',
      error: ''
    }
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
    console.log(this.state)
    if (this.state.chatroomName === '') {
      this.setState({error: "Please fill in a name."});
    } else {
      // Send API
      axios.post('/api/createchatroom', {
        name: this.state.chatroomName
      })
      .then((response) => {
        console.log(response);
        if (response.data.err) {
          this.setState({error: response.data.err});
        } else {
          this.setState({error: ""});
          this.props.setViews(false);
          this.props.setActiveChatroom(response.data.chatroomID, response.data.chatroomName, response.data.stringKey);
          this.props.appendChatroomList(response.data.chatroomName, response.data.stringKey);
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
      <div className="CreateChatroom">
        <Row className="show-grid">
          <Col xs={12} md={12}>
            <h2 className="header">Create a Chatroom</h2>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={12} md={8} mdPush={2}>
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
              <FormGroup controlId="formHorizontalChatroomName">
                <Col componentClass={ControlLabel} sm={2}>
                  Name
                </Col>
                <Col sm={10}>
                  <FormControl type="text" placeholder="Enter a Chatroom Name" name="chatroomName" onChange={this.handleInputChange.bind(this)} value={this.state.chatroomName}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button type="submit" bsStyle="success" block>Start a new Chatroom!</Button>
                </Col>
              </FormGroup>
            </Form>
            {errorMessage}
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateChatroom;
