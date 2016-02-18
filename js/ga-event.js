jQuery(function($){
	$('body').on('click', 'h1.logo', function(e){
		ga('chaiparty.send', 'event', 'logo', 'click', 'logo');
	}).on('click', '.video-list li', function(e){
		ga('chaiparty.send', 'event', 'youtube-list', 'click', $(this).attr("data-id"));
	}).on('click', '#ticket-info .kktix-link', function(e){
		ga('chaiparty.send', 'event', 'ticket-info', 'click', 'kktix');
	});
});