import React, { Component } from 'react';
import axios from 'axios';
// import logo from './logo.svg';
// import App from './App';
import './LoginControl.css';
import Login from './Login'
import Dashboard from './Dashboard'
import Register from './Register'
import {Navbar, Button} from 'react-bootstrap';

class LoginControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      displayName: '',
      chatroomList: [],
      isLoggedIn: false,
      isToRegister: false
    }
    this.setLogin = this.setLogin.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.getDisplayName = this.getDisplayName.bind(this);
    this.getChatroomList = this.getChatroomList.bind(this);
    this.appendChatroomList = this.appendChatroomList.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
  }

  setLogin(isLoggedIn, username, displayName, chatroomList) {
    this.setState({
      isLoggedIn: isLoggedIn, 
      username: username, 
      displayName: displayName, 
      chatroomList: chatroomList
    });
  }

  getUsername() {
    return this.state.username;
  }

  getDisplayName() {
    return this.state.displayName;
  }

  getChatroomList() {
    return this.state.chatroomList;
  }

  appendChatroomList(chatroomName, chatroomKey) {
    var tempList = this.state.chatroomList;
    tempList.push({'chatroomName': chatroomName, 'chatroomKey': chatroomKey});
    this.setState({chatroomList: tempList});
    // Send API
    axios.post('/api/appendChatroomToList', {
      chatroomName: chatroomName,
      chatroomKey: chatroomKey
    })
    .then((response) => {
      console.log(response);
      if (response.data.err) {
        this.setState({error: response.data.err});
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  login() {
    this.setState({isToRegister: false});
  }

  logout() {
    //Send API
    axios.get('/api/logout')
    .then((response) => {
      console.log(response);
      this.setLogin(false, '', '', []);
    })
    .catch(function (error) {
      console.log(error);
    });
    console.log(this.state.isLoggedIn);
  }

  register() {
    this.setState({isToRegister: true});
  }

  componentDidMount() {
    // Send API
    axios.get('/api/load')
    .then((response) => {
      // console.log(response.data.err);
      if (response.data.err) {
        this.setState({isLoggedIn: false});
      } else {
        this.setState({
          isLoggedIn: true, 
          username: response.data.username, 
          displayName: response.data.displayName, 
          chatroomList: response.data.chatroomList
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    let content = null;
    let navbarbutton = "";
    let navbarcontent = "";
    // console.log("LoginControl " + this.state.isLoggedIn);
    // console.log(this.state);
    if (this.state.isLoggedIn) {
      navbarcontent = <span>Signed in as {this.getUsername()}</span>;
      navbarbutton = <Button bsStyle="danger" onClick={()=> {this.logout();}} block>Sign Out</Button>;
      content = <Dashboard ref="dashboard" getUsername={this.getUsername} getDisplayName={this.getDisplayName} getChatroomList={this.getChatroomList} appendChatroomList={this.appendChatroomList}/>;
    } else {
      if (this.state.isToRegister) {
        navbarcontent = <span>Welcome!</span>;
        navbarbutton = <Button bsStyle="success" onClick={()=> {this.login();}} block>Sign In</Button>;
        content = <Register login={this.login} setLogin={this.setLogin}/>;
      } else {
        navbarcontent = <span>Welcome!</span>;
        navbarbutton = <Button bsStyle="primary" onClick={()=> {this.register();}} block>Register</Button>;
        content = <Login setLogin={this.setLogin}/>;
      }
    }

    return (
      <div className="LoginControl">
        <div>
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a onClick={() => { 
                  if (this.state.isLoggedIn === true) {
                    this.refs.dashboard.setViews(true); 
                    this.refs.dashboard.setActiveChatroom('', '', ''); 
                    this.refs.dashboard.setActiveChatroomMsgPack([]);
                  } else {
                    this.login();
                  }
                }}>Chatroom</a>
              </Navbar.Brand>
            </Navbar.Header>
            <Navbar.Text>
              {navbarcontent}
            </Navbar.Text>
            <Navbar.Form pullRight>
              {navbarbutton}
            </Navbar.Form>
          </Navbar>
        </div>
        {content}
      </div>
    );
  }
}

export default LoginControl;
