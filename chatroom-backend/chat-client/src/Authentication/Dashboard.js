import React, { Component } from 'react';
// import logo from './logo.svg';
// import App from './App';
import './Dashboard.css';
import CreateChatroom from './Chatroom/CreateChatroom';
import ViewChatroom from './Chatroom/ViewChatroom';
import JoinChatroom from './Chatroom/JoinChatroom';
import ViewChatroomContent from './Chatroom/ViewChatroomContent';
import {Grid, Row, Col} from 'react-bootstrap';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDashboard: true,
      activeChatroomID: '',
      activeChatroomName: '',
      activeStringKey: '',
      activeLastMsgId: '',
      activeChatroomMsgPack: []
    }
    this.setViews = this.setViews.bind(this);
    this.setActiveChatroom = this.setActiveChatroom.bind(this);
    this.getActiveChatroomID = this.getActiveChatroomID.bind(this);
    this.getActiveChatroomName = this.getActiveChatroomName.bind(this);
    this.getActiveStringKey = this.getActiveStringKey.bind(this);
    this.setActiveLastMsgId = this.setActiveLastMsgId.bind(this);
    this.getActiveLastMsgId = this.getActiveLastMsgId.bind(this);
    this.setActiveChatroomMsgPack = this.setActiveChatroomMsgPack.bind(this);
    this.getActiveChatroomMsgPack = this.getActiveChatroomMsgPack.bind(this);
  }

  setViews(isDashboard) {
    this.setState({isDashboard: isDashboard});
  }

  setActiveChatroom(chatroomID, chatroomName, stringKey, lastMsgId) {
    this.setState({
      activeChatroomID: chatroomID,
      activeChatroomName: chatroomName,
      activeStringKey: stringKey,
      activeLastMsgId: lastMsgId
    });
    if (this.state.isDashboard === false) {
      this.refs.viewContent.clearActiveChatroomTypeBox();
    }
  }

  getActiveChatroomID() {
    return this.state.activeChatroomID;
  }

  getActiveChatroomName() {
    return this.state.activeChatroomName;
  }

  getActiveStringKey() {
    return this.state.activeStringKey;
  }

  setActiveLastMsgId(lastMsgId) {
    this.setState({ activeLastMsgId: lastMsgId });
  }

  getActiveLastMsgId() {
    return this.state.activeLastMsgId;
  }

  setActiveChatroomMsgPack(msgPack) {
    this.setState({activeChatroomMsgPack: msgPack});
  }

  getActiveChatroomMsgPack() {
    return this.state.activeChatroomMsgPack;
  }

  render() {
    let content = null;
    let message = null;
    let panel = null;
    // console.log("Dashboard " + this.state.isDashboard);
    // console.log(this.state);
    if (this.state.isDashboard) {
      message = <h2 className="text-left greetings">Welcome, {this.props.getDisplayName()}!&nbsp;<small>Select a Chatroom to start chatting.</small></h2>;
      content = <CreateChatroom setViews={this.setViews} setActiveChatroom={this.setActiveChatroom} appendChatroomList={this.props.appendChatroomList}/>;
      panel = <JoinChatroom setViews={this.setViews} setActiveChatroom={this.setActiveChatroom} getChatroomList={this.props.getChatroomList} appendChatroomList={this.props.appendChatroomList} getActiveStringKey={this.getActiveStringKey} setActiveChatroomMsgPack={this.setActiveChatroomMsgPack}/>;
    } else {
      message = <ViewChatroom setViews={this.setViews} setActiveChatroom={this.setActiveChatroom} getActiveChatroomID={this.getActiveChatroomID} getActiveChatroomName={this.getActiveChatroomName} getActiveStringKey={this.getActiveStringKey}/>;
      content = <ViewChatroomContent ref="viewContent" getActiveChatroomMsgPack={this.getActiveChatroomMsgPack} getActiveStringKey={this.getActiveStringKey} getActiveLastMsgId={this.getActiveLastMsgId} getActiveChatroomID={this.getActiveChatroomID} setActiveChatroomMsgPack={this.setActiveChatroomMsgPack} setActiveLastMsgId={this.setActiveLastMsgId}/>;
      panel = <JoinChatroom setViews={this.setViews} setActiveChatroom={this.setActiveChatroom} getChatroomList={this.props.getChatroomList} appendChatroomList={this.props.appendChatroomList} getActiveStringKey={this.getActiveStringKey} setActiveChatroomMsgPack={this.setActiveChatroomMsgPack}/>;
    }

    return(
      <div className="Dashboard">
        <Grid>
            <Row className="show-grid wholePanel">
              <Col xs={4} md={4} className="leftPanel">
                <div className="leftPanel2">{panel}</div>
              </Col>
              <span className="border-right"></span>
              <Col xs={8} md={8}>
                <Col xs={12} md={12}>
                  <div>{message}</div>
                </Col>
                <Col xs={12} md={12}>
                  <div>{content}</div>
                </Col>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
}

export default Dashboard;
