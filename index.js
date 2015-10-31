var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {};

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	// on connection we want to show them who's in the chat
	io.emit('updateUserList', users);

	socket.on('disconnect', function(){
		console.log('user disconnected');
		socket.broadcast.emit('alertUsers', socket.username + " has left the room", 'user-left');

		// delete user from users hash and update users list
		delete users[socket.username];
		socket.broadcast.emit('updateUserList', users);

	});

	socket.on('createUsername', function(username){
		if(username != '') {
			socket.username = username;
			users[username] = username;
			// add chat message alerting users
			io.emit('alertUsers', username + " has joined the room", 'user-joined');
			// add user to users list
			io.emit('updateUserList', users);
		}
	});

	socket.on('sendChatMessage', function(msg){
		if(msg != '') {
			io.emit('sendChatMessage', socket.username, msg);
		}
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});