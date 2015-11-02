var express = require('express');
var moment = require('moment');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.set('transports', [ 'polling', 'websocket' ]);

// development
// http.listen(3000, function(){
// 	console.log('listening on *:3000');
// });

// production
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Node app is running on port ', port);
});

//var http = require('http').Server(app);
var users = {};

app.use('/assets', express.static(__dirname + '/assets'));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	// on connection we want to show them who's in the chat
	io.emit('updateUserList', users);

	socket.on('createUsername', function(username){
		if(username != '') {
			socket.username = username;
			users[username] = username;
			// add chat message alerting users
			io.emit('alertUsers', username + " has joined the room", 'user-joined', moment().format('h:mm:ss a'));
			// add user to users list
			io.emit('updateUserList', users);
		}
	});

	socket.on('sendChatMessage', function(msg){
		if(msg != '') {
			io.emit('sendChatMessage', socket.username, msg, moment().format('h:mm:ss a'));
		}
	});

	socket.on('disconnect', function(){
		// only display alert for users with a username
		if(socket.username != undefined) {
			socket.broadcast.emit('alertUsers', socket.username + " has left the room", 'user-left', moment().format('h:mm:ss a'));
		}

		// delete user from users hash and update users list
		delete users[socket.username];
		socket.broadcast.emit('updateUserList', users);

	});
});