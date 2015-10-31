$( document ).ready(function() {

	$(window).on('load resize', function(){
    	var viewportHeight = $(window).height();
		$("#message-log-container").height(viewportHeight-150);
	});
    
});