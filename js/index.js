var scroll_to_mute = function(){
	if( window.pageYOffset > $(window).height() ){
		player.setVolume(0);
	}else if( window.pageYOffset <= $(window).height() ){
		//根據滑動高度決定音量
		player.setVolume(parseInt(100*(($(window).height() - window.pageYOffset)/$(window).height())));
	}
}

jQuery(function($){
	if (window.matchMedia("screen and (max-width: 667px)").matches) {
		$.browser = 'mobile';
	} else if (window.matchMedia("screen and (min-width: 668px) and (max-width: 1024px)").matches) {
		$.browser = 'pad';
	} else {
		$.browser = 'desktop';
	}

	$.getJSON("config.json?t=1455617078", function(config) {
		var get_fanily_post = function(keyword, callback) {
			$.ajax({
				url : config.api+"search/lists/"+keyword,
				type : "get",
				dataType : "text",
			}).done(function(data){
				 callback(data);
			});
		};

		//prepend nav
		var nav_html = "";
		$.each(config.nav, function(url, name){
			nav_html += '<li><a href="#'+url+'">'+name+'</a></li>';
		});
		$('.nav-ul').prepend(nav_html);
		$('.mobile-menu-ul').prepend(nav_html);
		$('.mobile-nav-ul').prepend(nav_html);

		//append video
		if ($.browser === 'mobile') {
			$('#background-video').remove();
			$("#player").css("top" , ($(window).height() - $("#player").height())/2);

			$(window).scroll(function () {
				if ($(this).scrollTop() > 100) {
					$('.mobile-menu').fadeIn();
				} else {
					$('.mobile-menu').fadeOut();
				}
			});
		}else{
	    	$.getScript("js/jquery.tubular.min.js?t=2").done(function() {
				$('#background-video').tubular({videoId: config.video[0] , mute : false});
				window.addEventListener('scroll', scroll_to_mute , false);
			});
		}

		//append video-list
		var video_html = "";
		$.each(config.video, function(k,id){
			video_html += '<li data-id="'+id+'" style="background-image:url(https://i.ytimg.com/vi/'+id+'/hqdefault.jpg);">';
			if (k === 0) {
				video_html += '<span class="glyphicons glyphicons-pause"></span>';
			} else {
				video_html += '<span class="glyphicons glyphicons-play"></span>';
			}
			video_html += '</li>';
		});
		$('.video-list').append(video_html);

		//append character
		var character_html = "";
		$.each(config.character, function(k,name){
			character_html += '<div class="character" data-id="'+k+'">';
			if (window.devicePixelRatio === 2) {
				character_html += '<img src="img/character/thumb/'+k+'@2x.jpg">';
			} else {
				character_html += '<img src="img/character/thumb/'+k+'.jpg">';
			}
			
			character_html += '<span>'+name+'</span></div>';
			k++;
		});
		$('#cast .character-list').append(character_html);


		//append beauty
		var beauty_html = "";
		$.each(config.beauty, function(k,title){
			k++;
			beauty_html += '<a href="img/beauty/'+k+'.jpg" data-sub-html="'+title+'">';
			beauty_html += '<img src="img/beauty/thumb/'+k+'.jpg">';
			beauty_html += '</a>';
		});
		$('#imageGallery').append(beauty_html).lightGallery({
			thumbnail: true,
			showThumbByDefault: true,
			download: false
		});
		$('#imageGallery a').addClass('show');

		//append songlist
		var songlist_html = "";
		$.each(config.songlist, function(k,v){
			songlist_html += '<div class="song"><span class="title">'+v.title+'</span>';
			songlist_html += '<div class="info">';
			songlist_html += '<img class="thumb" src="http://img.youtube.com/vi/'+v.id+'/hqdefault.jpg">';
			songlist_html += '<span data-id="'+v.id+'" class="glyphicons glyphicons-play"></span>';
			songlist_html += '<div class="box"><a href="https://www.youtube.com/watch?v='+v.id+'" target="_blank">';
			songlist_html += '<span class="title">'+v.song+'</span></a>';
			songlist_html += '<span class="singer"><span>By</span> '+v.singer+'</span>';
			songlist_html += '<div class="chai"><img class="avatars" src="'+v.avatars+'">';
			if(v.chailink !== "") {
				songlist_html += '<a href="'+v.chailink+'" target="_blank"><span class="name">'+v.chai+'<span>推薦</span></a></span></div>';
			} else {
				songlist_html += '<span class="name">'+v.chai+'<span>推薦</span></span></div>';
			}
			songlist_html += '</div></div></div>';
		});
		$('.song-list').append(songlist_html);

		// append post
		$.each(config.keywords, function(id, data){
			$.each(data, function(k, v){
				var tab_html = '<li>'+v.tab+'</li>';
				var html = '<div class="post-content">';
				if (v.current) {
					tab_html = '<li class="current">'+v.tab+'</li>';
					html = '<div class="post-content current">'
				}

				get_fanily_post(v.keyword, function(data){
					temp = JSON.parse(data);
					 if (temp.length == 0) {
						html += '<p class="message">目前尚無文章，敬請期待！</p>';
					 } else {
					 	html += '<div class="grid post-row">';
						var n = 0;
						for( $this in temp ){
							if (n >= 8) {
								break;
							}
							var data = temp[$this];
							if (data.post_image == '') {
								data.post_image = 'img/default-post-image.png';
							}
							html += '<div class="post-block grid-item">';
							html += '<a href="https://www.fanily.tw/post/'+data.id+'" target="_blank">';
							html += '<img src="'+data.post_image+'">';
							html += '<span>'+data.post_title+'</span>';
							html += '</a></div>';
							n++;
						}
						html += '</div>';
						html += '<a class="more" target="_blank" href="https://www.fanily.tw/search/tag/'+v.keyword+'">看更多'+v.tab+'</a>';
					}

					html += '</div>';
					$('#'+id+' .tab').append(tab_html);
					$('#'+id+' .post-container').append(html);
					if (v.current) {
						setInterval(function(){ 
							$('#'+id+' .post-container .current').find('.grid').masonry({
								"itemSelector": '.grid-item'
							}); 
						}, 3000);
					};
				});
			});
		});

	});

	if ($.browser !== 'desktop') {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});
	}

	$('body').on('click', '.menu .mobile-hamburger', function(e){
		var toggled = $(this).data('toggled');
		$(this).data('toggled', !toggled);

		if (!toggled) {
			$('.mobile-nav-ul').addClass('show');
		} else {
			$('.mobile-nav-ul').removeClass('show');
		}
	}).on('click', '.mobile-nav-ul a', function(e){
		$('.menu .mobile-hamburger').click();
		
		var $li = $(this).parent();
		if (typeof($li.attr('class')) === "undefined") {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
						scrollTop: target.offset().top
				}, 1000);
				return false;
			}
        }
	}).on('click', '.mobile-menu', function(e){
		var toggled = $(this).data('toggled');
		$(this).data('toggled', !toggled);

		if (!toggled) {
			$('.mobile-menu-ul').slideDown('normal');
		} else {
			$('.mobile-menu-ul').slideUp('fast');
		}
	}).on('click', '.mobile-menu-ul a', function(e){
		$('.mobile-menu').click();
		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		if (target.length) {
			$('html,body').animate({
					scrollTop: target.offset().top
			}, 1000);
			return false;
		}
	}).on('click', '.menu .hamburger', function(e){
		var toggled = $(this).data('toggled');
		$(this).data('toggled', !toggled);

		if (!toggled) {
			$('.nav-ul').addClass('show');
		} else {
			$('.nav-ul').removeClass('show');
		}
	}).on('click', '.nav-ul a', function(e){
		$('.menu .hamburger').click();
		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		if (target.length) {
			$('html,body').animate({
					scrollTop: target.offset().top
			}, 1000);
			return false;
		}
	}).on('click', '#back-top a', function(e){
		e.preventDefault();
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	}).on('click', '.page-down .glyphicons', function(e){
		$('html,body').animate({
			scrollTop: window.innerHeight
			
		}, 600);
	}).on('click', '.video-list li', function(e){
		$(this).siblings().find('.glyphicons').removeClass('glyphicons-pause').addClass('glyphicons-play-button');
		$(this).find('.glyphicons').removeClass('glyphicons-play-button').addClass('glyphicons-pause');
		if(window.matchMedia("screen and (max-width: 667px)").matches){
			 $("#mobile-video-background").show();
			 $("iframe#player").attr("src","http://www.youtube.com/embed/"+$(this).attr("data-id")+"?enablejsapi=1")
			 $("span").click(function(){
				$("#mobile-video-background").hide();
				$("iframe#player").attr("src","");
			});
		}else{
			player.loadVideoById($(this).attr("data-id"));
		}
	}).on('click', '.menu .share', function(e){
		var toggled = $(this).data('toggled');
		$(this).data('toggled', !toggled);

		if (!toggled) {
			$('.share-ul').addClass('show');
		} else {
			$('.share-ul').removeClass('show');
		}
	}).on('click', '.share-ul li', function(e){
		var $self = $(this)
			, title = $('title').text()
			, url = window.location.href;

		if ($self.hasClass("fb")) {
			window.open('https://www.facebook.com/share.php?u='+encodeURI(url), '_blank');
		}
		if ($self.hasClass("plus")) {
			window.open('https://plus.google.com/share?url=' + encodeURI(url), '_blank');
		}
		if ($self.hasClass("weibo")) {
			window.open('http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url, '_blank');
		}
		if ($self.hasClass("line")) {
			window.open("http://line.naver.jp/R/msg/text/?"+url);
		}

		$('.menu .share').click();
	}).on('click', '#fanily-post .post-list .tab li', function(e){
		var $post_div = $('#fanily-post .post-list');
		var index = $post_div.find('.tab li').index(this);

		$(this).siblings().removeClass('current');
		$(this).addClass('current');

		$post_div.find('.post-content').not(index).removeClass('current');
		$post_div.find('.post-content').eq(index).addClass('current').find('.grid').masonry({
			"itemSelector": '.grid-item'
		});
	}).on('click', '#party-post .post-list .tab li', function(e){
		var $post_div = $('#party-post .post-list');
		var index = $post_div.find('.tab li').index(this);

		$(this).siblings().removeClass('current');
		$(this).addClass('current');

		$post_div.find('.post-content').not(index).removeClass('current');
		$post_div.find('.post-content').eq(index).addClass('current').find('.grid').masonry({
			"itemSelector": '.grid-item'
		});
	}).on('click', "#songlist .glyphicons-play", function(e){
		window.open('https://www.youtube.com/watch?v='+$(this).attr('data-id'), '_blank');

	}).on('click', '#cast .character', function(e){
		var id = $(this).attr('data-id');
		$('.cast-lightbox .left-col img').attr('src', 'img/character/'+id+'.jpg');
		$('.cast-lightbox .right-col[data-id='+id+']').addClass('show');

		$('.cast-lightbox').addClass('show');
		$('body').css({'overflow':'hidden'});
	}).on('click', '.cast-lightbox .close', function(e){
		$('.cast-lightbox .right-col').removeClass('show');
		$('.cast-lightbox').removeClass('show');
		
		$('body').css({'overflow':'auto'});
	});

	var clip = new ZeroClipboard( $(".share-ul li.copy") );
	clip.on( 'ready', function(event) {
		clip.on( 'copy', function(event) {
			event.clipboardData.setData("text/plain", window.location.href);
		} );
		clip.on( 'aftercopy', function(event) {
			alert('複製網址成功！');
		} );
	} );
});
