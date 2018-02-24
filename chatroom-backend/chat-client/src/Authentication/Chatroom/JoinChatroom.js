import React, { Component } from 'react';
import axios from 'axios';
// import logo from './logo.svg';
// import App from './App';
import './JoinChatroom.css';
import {Col, Panel, Form, FormGroup, ControlLabel, FormControl, Button, Alert, ListGroup, ListGroupItem} from 'react-bootstrap';

class JoinChatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatroomKey: '',
      error: ''
    }
    this.setViewChatroom = this.setViewChatroom.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  setViewChatroom(key, name) {
    // Send API
    axios.get('/api/getchat/' + key)
    .then((response) => {
      console.log(response);
      if (response.data.err) {
        this.setState({error: response.data.err});
      } else {
        this.props.setViews(false);
        this.props.setActiveChatroom(response.data.chatroomID, response.data.chatroomName, response.data.stringKey, response.data.largestMsgId);
        this.props.setActiveChatroomMsgPack(response.data.msgPack);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleSubmit(event) {
    event.preventDefault(); 
    console.log(this.state)
    if (!this.state.chatroomKey) {
      this.setState({error: "Please fill in a key."});
    } else {
      // Send API
      axios.get('/api/getchat/' + this.state.chatroomKey)
      .then((response) => {
        console.log(response.data);
        if (response.data.err) {
          this.setState({error: response.data.err});
        } else {
          this.setState({error: ""});
          this.props.setViews(false);
          this.props.setActiveChatroom(response.data.chatroomID, response.data.chatroomName, response.data.stringKey, response.data.largestMsgId);
          this.props.appendChatroomList(response.data.chatroomName, response.data.stringKey);
          this.props.setActiveChatroomMsgPack(response.data.msgPack);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  render() {
    var chatroomList = this.props.getChatroomList();
    var activeStringKey = this.props.getActiveStringKey();
    var chatroomListItems = chatroomList.map((item) => {
      if (item.chatroomKey === activeStringKey) {
        return <ListGroupItem key={item.chatroomKey} onClick={() => {this.setViewChatroom(item.chatroomKey, item.chatroomName);}} header={item.chatroomName} active>Code: {item.chatroomKey}</ListGroupItem>
      } else {
        return <ListGroupItem key={item.chatroomKey} onClick={() => {this.setViewChatroom(item.chatroomKey, item.chatroomName);}} header={item.chatroomName}>Code: {item.chatroomKey}</ListGroupItem>
      }
    });
    let errorMessage = null;
    if (this.state.error) {
      errorMessage = <Alert bsStyle="danger"><p className="text-left">{this.state.error}</p></Alert>;
    }
    return(
      <div className="JoinChatroom">
        <Panel>
          <Panel.Heading><h4 className="text-left">Join a Chatroom</h4></Panel.Heading>
          <Panel.Body>
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
              <FormGroup controlId="formHorizontalChatroomName">
                <Col componentClass={ControlLabel} sm={2}>
                  Key
                </Col>
                <Col sm={10}>
                  <FormControl type="text" placeholder="Enter Chatroom Key" name="chatroomKey" onChange={this.handleInputChange.bind(this)} value={this.state.chatroomKey}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button type="submit" bsStyle="primary" block>Continue</Button>
                </Col>
              </FormGroup>
            </Form>
            {errorMessage}
          </Panel.Body>
        </Panel>

        <Panel className="chatroomListPanel">
          <Panel.Heading><h4 className="text-left">Chatroom List</h4></Panel.Heading>
          <Panel.Body className="chatListDiv">
            <div className="chatListContainer">
              <ListGroup>{chatroomListItems}</ListGroup>
            </div>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

export default JoinChatroom;
