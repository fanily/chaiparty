jQuery(function($){
	$('body').on('click', 'h1.logo', function(e){
		// logo
		ga('chaiparty.send', 'event', 'logo', 'click', 'logo');
	}).on('click', '#back-top a', function(e){
		// backtop
		ga('chaiparty.send', 'event', 'back-top', 'click', 'back-top');
	}).on('click', '.menu li', function(e){
		//menu
		var val = $(this).attr('class');
		if (val === "hamburger") {
			val = "menu";
		}
		ga('chaiparty.send', 'event', 'menu', 'click', val);

	}).on('click', '.nav-ul a', function(e){
		//nav-list
		var val = $(this).attr('href').replace("#","");
		ga('chaiparty.send', 'event', 'menu', 'click', val);

	}).on('click', '.mobile-nav-ul a', function(e){
		var val = $(this).parent().attr('class');
		if (typeof(val) === "undefined") {
			//menu
			val = $(this).attr('href').replace("#","");
        }
        ga('chaiparty.send', 'event', 'menu', 'click', val);
    }).on('click', '.mobile-menu', function(e){
    	// mobile menu
     	ga("chaiparty.send", "event", "menu", "click", "mobile-menu");
	}).on('click', '.mobile-menu-ul a', function(e){
		//mobile-menu
		var val = $(this).attr('href').replace("#","");
		ga('chaiparty.send', 'event', 'menu', 'click', val);

	}).on('click', '.share-ul li', function(e){
		//share-list
		var val = $(this).attr('class').split(" ");
		ga('chaiparty.send', 'event', 'share', 'click', val[0]);

	}).on('click', '.video-list li', function(e){
		// video-list
		ga('chaiparty.send', 'event', 'youtube-list', 'click', $(this).attr("data-id"));
	
	}).on('click','.page-down .glyphicons',function(e){
		ga('chaiparty.send', 'event', 'page-down', 'click', 'page-down');

	}).on('click','#fanily-post .tab li', function(e){
		//fanily-post
		ga('chaiparty.send', 'event', 'fanily-post', 'click', $(this).text());
	}).on('click','#party-post .tab li', function(e){
		//party-post
		ga('chaiparty.send', 'event', 'party-post', 'click', $(this).text());
	}).on('click', '#ticket-info .kktix-link', function(e){
		// kktix link
		ga('chaiparty.send', 'event', 'ticket-info', 'click', 'kktix');
	});
});