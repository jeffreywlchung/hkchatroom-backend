var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var randomstring = require("randomstring");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json([{	id: 1,	username: "samsepi0l"}, {	id: 2,	username: "D0loresH4ze" }]);
});

/* GET load page */
router.get('/load', function(req, res, next) {
  if(req.session.userId && req.session.displayName && req.session.username) {
    var db = req.db;
    var collection = db.get('user');
    var filter = {'_id': req.session.userId};

    //QUERY: to get login information of current user
    collection.find(filter, {}, function(err, signedInUser) {
      if (err === null) {
        if (signedInUser.length == 1) {
          //SUCCESSFUL: Create session, Send json string
          req.session.userId = signedInUser[0]._id;
          req.session.displayName = signedInUser[0].displayName;
          req.session.username = signedInUser[0].username;
          var chatroomList = [];
          if (signedInUser[0].chatroomList) {
            chatroomList = signedInUser[0].chatroomList;
          }
          var displayName = signedInUser[0].displayName;
          var username = signedInUser[0].username;
          res.json({'username': username, 'chatroomList': chatroomList, 'displayName': displayName});
        } else {
          //FAILURE: Send Incorrect query result message
          var err = "Incorrect query result";
          res.json({'err': err});
        }
      } else {
        //FAILURE: Send query error message
        res.json({'err': err});
      }
    });
  } else {
    res.json({'err': "Not signed in."})
  }
});

/* POST from login page */
router.post('/login', bodyParser.json(), function(req, res) {
  var db = req.db;
  var collection = db.get('user');
  var filter = {'username': req.body.username};

  //QUERY: to get login information of current user
  collection.find(filter, {}, function(err, signedInUser) {
    if (err === null) {
      //if ((signedInUser[0].password == req.body.password)) {
      if ((signedInUser.length == 1) && (signedInUser[0].password == req.body.password)) {
        //SUCCESSFUL: Create session, Send json string
        req.session.userId = signedInUser[0]._id;
        req.session.displayName = signedInUser[0].displayName;
        req.session.username = signedInUser[0].username;
        var chatroomList = [];
        if(signedInUser[0].chatroomList) {
          chatroomList = signedInUser[0].chatroomList;
        }
        var displayName = signedInUser[0].displayName;
        res.json({'username': req.body.username, 'chatroomList': chatroomList, 'displayName': displayName});
      } else {
        //FAILURE: Send Incorrect Password message
        var err = "Incorrect Password";
        res.json({'err': err});
      }
    } else {
      //FAILURE: Send query error message
      res.json({'err': err});
    }
  });
});

/* GET logout page */
router.get('/logout', function(req, res) {
  req.session.userId = null;
  req.session.displayName = null;
  req.session.username = null;
  res.send("");
});

/* POST register page */
router.post('/register', bodyParser.json(), function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var displayName = req.body.displayName;

  var db = req.db;
  var collection = db.get('user');
  var usernameFilter = {'username': username};;

  //QUERY: to find if username already taken 
  collection.find(usernameFilter, {}, function(err, result) {
    if (err === null) {
      if (result.length === 0) {
        var createUser = {'username': username, 'password': password, 'displayName': displayName};
        //QUERY: to create a new user
        collection.insert(createUser, function(err, result){
          if (err) {
            //FAILURE: Send query error message
            res.send(err);
          } else {
            //SUCCESSFUL: Return user information on valid insertion
            res.json({'username': result.username, 'displayName': result.displayName, 'chatroomList': []});
          }
        });
      } else {
        //FAILURE: Send Username taken message
        var err = "Username already taken.";
        res.json({'err': err});
      }
    } else {
      //FAILURE: Send query error message
      res.json({'err': err});
    }
  });
});

/* POST createchatroom page */
router.post('/createchatroom', bodyParser.json(), function(req, res) {
  var name = req.body.name;
  var username = req.session.username;

  var db = req.db;
  var collection = db.get('chatroom');
  var flag = true;
  do {
    // Generate new chatroom key
    var newChatroom = randomstring.generate(6);
    var filter = {'stringKey': newChatroom};
    console.log(filter);
    //QUERY: to find if new chatroom key is already taken
    collection.find(filter, {}, function(err, result) {
      if (err === null) {
        if (result.length === 0) {
          var createChatroom = {'stringKey': newChatroom, 'name': name};
          //QUERY: to create a new chatroom
          collection.insert(createChatroom, function(err, result){
            if (err) {
              //FAILURE: Send query error message
              res.send(err);
            } else {
              //SUCCESSFUL: Send json string
              res.json({'stringKey': newChatroom, 'chatroomName': name, 'chatroomID': createChatroom._id});
            }
          });
          flag = true;
        }
      } else {
        //FAILURE: Send query error message
        res.json({'err': err});
      }
    });
  } while (flag == false);
});

/* POST appendChatroomToList page */
router.post('/appendChatroomToList', bodyParser.json(), function(req, res) {
  var chatroomName = req.body.chatroomName;
  var chatroomKey = req.body.chatroomKey;
  var username = req.session.username;

  var db = req.db;
  var userCollection = db.get('user');
  var userFilter = {'username': username};

  //QUERY: to get information of current user
  userCollection.update(userFilter, {$addToSet: {'chatroomList': {'chatroomName': chatroomName, 'chatroomKey': chatroomKey}}}, function(err, result) {
    if (err === null) {
      //SUCCESSFUL: Send success message in json
      res.json({'result': 'success'});
    } else {
      //FAILURE: Send query error message
      res.json({'err': err});
    }
  });
});


/* GET getchat/:key page */
router.get('/getchat/:key', function(req, res) {
  var username = req.session.username;
  var stringKey = req.params.key;

  var db = req.db;
  var collection = db.get('chatroom');
  var chatroomFilter = {'stringKey': stringKey};

  //QUERY: to find chatroomid of specified chatroom
  collection.find(chatroomFilter, {}, function(err, chatroom){
    if (err === null) {
      if (chatroom.length === 1) {
        var chatroomID = chatroom[0]._id;
        var chatroomName = chatroom[0].name;

        var msgCollection = db.get('messages');
        var msgFilter = {'chatroomID': chatroomID.toString()};

        //QUERY: to get chatroom messages of the chatroom
        msgCollection.find(msgFilter, {}, function(err, msg){
          if (err === null) {
            var msgPack = [];
            var largestMsgId = 0;
            //SUCCESSFUL: Send json string
            if (msg.length > 0) {
              var tempDate = "";
              var checkDateAppeared = false;
              var counterFlag = 0;
              for (var index in msg) {
                (function(m) {
                  counterFlag++;
                  if (msg[m].date != tempDate) {
                    checkDateAppeared = false;
                    tempDate = msg[m].date;
                  } else {
                    checkDateAppeared = true;
                  }
                  msgPack.push({'_id': msg[m]._id, 'isSelf': (msg[m].senderID.toString() === req.session.userId.toString() ? true : false), 'isDateAppeared': checkDateAppeared, 'senderID': msg[m].senderID, 'senderName': msg[m].senderName, 'content': msg[m].content, 'date': msg[m].date, 'time': msg[m].time});
                  if (counterFlag == msg.length) {
                    largestMsgId = msg[m]._id.toString();
                    res.json({'chatroomName': chatroomName, 'chatroomID': chatroomID, 'stringKey': stringKey, 'largestMsgId': largestMsgId, 'msgPack': msgPack});
                  }
                }).call(this, index);
              }
            } else {
              //SUCCESSFUL: No MSG yet
              res.json({'chatroomName': chatroomName, 'chatroomID': chatroomID, 'stringKey': stringKey,'largestMsgId': largestMsgId, 'msgPack': msgPack, 'noMsgFlag': 'Yes'});
            }
          } else {
            //FAILURE: Send query error message
            res.json({'err': err});
          }
        });
      } else {
        //FAILURE: Cannot locate chatroom
        var err = "Cannot find such chatroom."
        res.json({'err': err});
      }
    } else {
      //FAILURE: Send query error message
      res.json({'err': err});
    }
  });
});

/* GET checkNewMsg/:key page */
router.get('/checkNewMsg/:key', function(req, res) {
  var username = req.session.username;
  var stringKey = req.params.key;

  var db = req.db;
  var collection = db.get('chatroom');
  var chatroomFilter = {'stringKey': stringKey};

  //QUERY: to find chatroomid of specified chatroom
  collection.find(chatroomFilter, {}, function(err, chatroom){
    if (err === null) {
      if (chatroom.length === 1) {
        var chatroomID = chatroom[0]._id;
        var chatroomName = chatroom[0].name;

        var msgCollection = db.get('messages');
        var msgFilter = {'chatroomID': chatroomID.toString()};

        //QUERY: to get chatroom messages of the chatroom
        msgCollection.findOne(msgFilter, {"sort":{_id: -1}}, function(err, msg){
          if (err === null) {
            if (msg === null) {
              //FAILURE: No message yet
              var err = "No message yet."
              res.json({'err': err});
            } else {
              //SUCCESSFUL: Send json string
              var largestMsgId = msg._id.toString();
              res.json({'msgId': largestMsgId});
            }
          } else {
            //FAILURE: Send query error message
            res.json({'err': err});
          }
        });
      } else {
        //FAILURE: Cannot locate chatroom
        var err = "Cannot find such chatroom."
        res.json({'err': err});
      }
    } else {
      //FAILURE: Send query error message
      res.json({'err': err});
    }
  });
});

/* POST postmessage/:chatroomid page */
router.post('/postmessage/:chatroomid', bodyParser.json(), function(req, res) {
  var db = req.db;
  var msgCollection = db.get('messages');
  var msgToInsert = {'senderID': req.session.userId, 'senderName': req.session.displayName, 'content': req.body.content, 'date': req.body.date, 'time': req.body.time, 'chatroomID': req.params.chatroomid};
  
  //QUERY: to insert a new message sent by current user
  msgCollection.insert(msgToInsert, function(err, result){
    if (err) {
      //FAILURE: Send query error message
      res.send(err);
    } else {
      //SUCCESSFUL: Return ID on valid insertion
      res.send(msgToInsert._id);
    }
  });
});



module.exports = router;
