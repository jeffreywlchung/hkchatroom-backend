import React, { Component } from 'react';
import axios from 'axios';
// import logo from './logo.svg';
// import App from './App';
import './ViewChatroomContent.css';
import {Form, FormGroup, Col, FormControl} from 'react-bootstrap';
import moment from 'moment'

class ViewChatroomContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeChatroomID: '',
      activeChatroomName: '',
      activeStringKey: '',
      message: ''
    }
    this.clearActiveChatroomTypeBox = this.clearActiveChatroomTypeBox.bind(this);
    this.checkMsg = this.checkMsg.bind(this);
    this.refreshMsgPack = this.refreshMsgPack.bind(this);
  }

  clearActiveChatroomTypeBox() {
    this.setState({message: ''});
  }

  checkMsg() {
    var currentMsgId = this.props.getActiveLastMsgId();
    // Send API
    axios.get('/api/checkNewMsg/' + this.props.getActiveStringKey())
    .then((response) => {
      console.log(response.data);
      if (response.data.msgId) {
        if (response.data.msgId !== currentMsgId) {
          this.props.setActiveLastMsgId(response.data.msgId);
          this.refreshMsgPack();
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  refreshMsgPack() {
    // Send API
    axios.get('/api/getchat/' + this.props.getActiveStringKey())
    .then((response) => {
      console.log(response.data);
      if (response.data.msgPack) {
        this.props.setActiveChatroomMsgPack(response.data.msgPack);
      }
    })
    .catch(function (error) {
      console.log(error);
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
    if (!(this.state.message === '')) {
      var now = new moment();
      console.log("now " + now);
      // Send API
      axios.post('/api/postmessage/' + this.props.getActiveChatroomID(), {
        content: this.state.message,
        date: now.format("ddd MMM DD YYYY"),
        time: now.format("HH:mm:ss")
      })
      .then((response) => {
        console.log(response);
        this.setState({message: ''});
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
    this.interval = setInterval(this.checkMsg, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    let noMsg = null;
    var msgItems = [];
    var msgPack = this.props.getActiveChatroomMsgPack();
    console.log(msgPack);
    if (msgPack.length > 0) {
      msgItems = msgPack.map((msg) => {
        if (msg.isDateAppeared) {
          return (msg.isSelf === true) ?
            // <div className="text-bubble"><div className="text"><p key={msg._id} className="text-right text">{msg.content}&nbsp;<span className="time">{msg.time}</span></p></div></div>
            // :
            // <div className="text-bubble"><div className="text"><p key={msg._id} className="text-left text"><span className="senderName">{msg.senderName}</span><br/>{msg.content}&nbsp;<span className="time">{msg.time}</span></p></div></div>
            // ;
            <p key={msg._id} className="myMsg msg text-justify">{msg.content}&nbsp;&nbsp;&nbsp;<span className="time">{msg.time}</span></p>
            :
            <p key={msg._id} className="otherMsg msg text-justify"><span className="senderName">{msg.senderName}</span><br/>{msg.content}&nbsp;&nbsp;&nbsp;<span className="time">{msg.time}</span></p>
            ;
        } else {
          return (msg.isSelf === true) ?
            // ([<p key={msg.date}><span className="date">{msg.date}</span></p>,<div className="text-bubble"><div className="text"><p key={msg._id} className="text-right text">{msg.content}&nbsp;<span className="time">{msg.time}</span></p></div></div>])
            // :
            // ([<p key={msg.date}><span className="date">{msg.date}</span></p>,<div className="text-bubble"><div className="text"><p key={msg._id} className="text-left text"><span className="senderName">{msg.senderName}</span><br/>{msg.content}&nbsp;<span className="time">{msg.time}</span></p></div></div>])
            // ;
            ([<Col sm={12}><p key={msg.date}><span className="date">{msg.date}</span></p></Col>,<p key={msg._id} className="myMsg msg text-justify">{msg.content}&nbsp;&nbsp;&nbsp;<span className="time">{msg.time}</span></p>])
            :
            ([<Col sm={12}><p key={msg.date}><span className="date">{msg.date}</span></p></Col>,<p key={msg._id} className="otherMsg msg text-justify"><span className="senderName">{msg.senderName}</span><br/>{msg.content}&nbsp;&nbsp;&nbsp;<span className="time">{msg.time}</span></p>])
            ;
        }
      });
    } else {
      msgItems = <p>No message yet :)</p>
    }
    return(
      <div key={'superdiv'} className="ViewChatroomContent">
        <div key={'conversationDiv'} className="conversationDiv">
          {noMsg}
          <div key={'msgsuperdiv'} className="conversationContainer">
            {msgItems}
            <p key={'msgbottom'} style={{ float:"left", clear: "both" }}
              ref={(el) => { this.messagesEnd = el; }}>
            </p>
          </div>
        </div>
        <footer className="sendMessage">
          <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
            <FormGroup controlId="formHorizontalMessage">
              <Col sm={12}>
                <FormControl type="text" placeholder="Type a message..." name="message" onChange={this.handleInputChange.bind(this)} value={this.state.message}/>
              </Col>
            </FormGroup>
          </Form>
        </footer>
      </div>
    );
  }
}

export default ViewChatroomContent;



