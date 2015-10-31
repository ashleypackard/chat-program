var socket = io();

// allow users to have usernames
$('#username-setup').submit(function(){
	var username = $('#username').val();
	if(username != '') {
		socket.emit('createUsername', username);
		$('#username').val('');
	}
	
	// don't allow the user to change their username
	$('#username-chosen').show();
	$('#username-form').hide();
	$('#client-username').text(username);
	return false;
});

// allow users to send chat messages
$('#send-message').submit(function(){
	var message = $('#m').val();
	if(message != '') {
		socket.emit('sendChatMessage', message);
		$('#m').val('');
	}
	
	return false;
});

socket.on('sendChatMessage', function(username, msg){
	$('#message-log').append("<b>"+username+"</b>" + ": " + msg + "<br />");
});

// print users in room to the users list
socket.on('updateUserList', function(users){
	$('#online-users').empty();
  $.each(users, function(key, value) {
    $('#online-users').append('<div>' + key + '</div>');
  });
});

// print users in room to the users list
socket.on('alertUsers', function(msg, status){
	$('#message-log').append("<b class="+status+">"+msg+"</b> <br />");
});