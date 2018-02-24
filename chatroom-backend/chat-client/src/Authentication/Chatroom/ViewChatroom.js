import React, { Component } from 'react';
// import logo from './logo.svg';
// import App from './App';
import './ViewChatroom.css';

class ViewChatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeChatroomID: '',
      activeChatroomName: '',
      activeStringKey: ''
    }
  }

  render() {
    return(
      <div className="ViewChatroom">
        <h2 className="text-left">{this.props.getActiveChatroomName()}&nbsp;&nbsp;<small>Code:&nbsp;{this.props.getActiveStringKey()}</small></h2>
      </div>
    );
  }
}

export default ViewChatroom;
