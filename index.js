var express = require('express');
var moment = require('moment');
var socketio = require('socket.io');

var app = express();
var io = socketio.listen(app);
var http = require('http').Server(app);
var users = {};

app.use('/assets', express.static(__dirname + '/assets'));
app.set('port', (process.env.PORT || 5000));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	// on connection we want to show them who's in the chat
	io.sockets.emit('updateUserList', users);

	socket.on('createUsername', function(username){
		if(username != '') {
			socket.username = username;
			users[username] = username;
			// add chat message alerting users
			io.sockets.emit('alertUsers', username + " has joined the room", 'user-joined', moment().format('h:mm:ss a'));
			// add user to users list
			io.sockets.emit('updateUserList', users);
		}
	});

	socket.on('sendChatMessage', function(msg){
		if(msg != '') {
			io.sockets.emit('sendChatMessage', socket.username, msg, moment().format('h:mm:ss a'));
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

// development
// http.listen(3000, function(){
// 	console.log('listening on *:3000');
// });

// production
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});