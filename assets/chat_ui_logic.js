var socket = io();
var loggedOnUsers = {};
var thisUser;

// allow users to have usernames
$('#username-setup').submit(function(){
	var username = $('#username').val();
	if(username != '' && isUnique(username)) {
		socket.emit('createUsername', username);
		thisUser = username;
		$('#username').val('');
		// don't allow the user to change their username
		$('#username-chosen').show();
		$('#message-form-container').show();
		$('#username-form').hide();
		$('#client-username').text(username);
	}
	else {
		$('#error').show();
		$('#username-setup').addClass('has-error');
	}
	
	return false;
});

function isUnique(username) {
	var found = false;
	$.each(loggedOnUsers, function(key, value) {
		if(username == key) {
			found = true;
			return false;
		}
	});
	return (found == true ? false : true);
}

// allow users to send chat messages
$('#send-message').submit(function(){
	var message = $('#m').val();
	if(message != '') {
		socket.emit('sendChatMessage', message);
		$('#m').val('');
	}
	
	return false;
});

socket.on('sendChatMessage', function(username, msg, timeStamp){
	$('#message-log').append("<p class='message-post'>"+timeStamp+" - "+"<b>"+username+"</b>" + ": " + msg + "</p>");
	scrollToBottom();
});

// scroll to bottom function
function scrollToBottom(){
	$('#message-log-container').animate({
        scrollTop: $('#message-log-container')[0].scrollHeight}, 50);
}
// print users in room to the users list
socket.on('updateUserList', function(users){
	// update the total number of users online
	var usersOnline = Object.keys(users).length;
	loggedOnUsers = users;

	$('#number-users-online').text(usersOnline);

	$('#users-online').text("User" + (usersOnline == 1 ? '' : 's') + " Online");

	// update the users list
	$('#online-users').empty();
  $.each(users, function(key, value) {
    if (thisUser == key) {
    	key = "**" + key;
    };

    $('#online-users').append('<div>' + key + '</div>');
  });
});

// print users in room to the users list
socket.on('alertUsers', function(msg, status, timeStamp){
	$('#message-log').append("<p class='message-post'>"+timeStamp+" - "+"<b class="+status+">"+msg+"</b> </p>");
	scrollToBottom();
});