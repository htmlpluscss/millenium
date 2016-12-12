/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

(function($){

	var showAlertUp,
		windowWidth,
		windowHeight,
		windowScrollTop,
		resizeTimeoutId,
		body = $('body'),
		main = $('.main'),
		$window = $(window);

	$window.on({
		resize: function(){
			clearTimeout(resizeTimeoutId);
			resizeTimeoutId = setTimeout(function(){
				pageResize();
			}, 100);
		},
		scroll: function(){
			windowScrollTop = $window.scrollTop();
		}
	});

	function pageResize(){
		windowWidth = $window.width();
		windowHeight = $window.height();
		main.css('min-height', windowHeight - $('#header').outerHeight() - $('#footer').outerHeight());

		$('.slide-show').each(function(){
			var h = 0;
			$(this).find('.slide-show__item-box').each(function(){
				var item = $(this).outerHeight(true);
				if(item > h)
					h = item;
			});
			if(h > 0)
				$(this).find('.slide-show__box').height(h);
		});
	}
	pageResize();

	$window.trigger('scroll');

// img-cover
	$('.img-cover').each(function(){
		var src = $(this).attr('data-img') === undefined ?
			$(this).find('img').attr('src') : $(this).attr('data-img');
		$(this).css('background-image','url('+src+')');
	});

// checkbox
	$('.checkbox').addClass('notsel').append('<i></i>');

// menu
	$('.menu-mobile-toggle').on('click',function(){
		$('#header').toggleClass('header--menu-show');
	});

// slideShow

	$.fn.slideShow = function(){

		var setSlider = function(){

			var slider = $(this),
				list = slider.find('.slide-show__item'),
				navNext = $('<a class="slide-show__next">'),
				navPrev = $('<a class="slide-show__prev">'),
				nav = $('<div class="slide-show__nav">');
			for(var i = 0; i < list.length; i++)
				nav.append('<a></a>');
			nav.children().on('click',function(){
				if($(this).hasClass('slide-show__nav--current')) return;
				var index = $(this).index();
				var btnClick = index > list.filter('.slide-show__item--active').index() ?
					slider.find('.slide-show__next'):
					slider.find('.slide-show__prev');
				btnClick.trigger('click',index);
			});

			navNext.add(navPrev).on('click',function(event,nextItem){
				if(list.filter('.slide-show__item--next').length>0) return;
				var next, t = $(this);
				var active = list.filter('.slide-show__item--active');
				if(t.hasClass('slide-show__next')){
					slider.addClass('slide-show--right');
					next = active.next().length>0 ? active.next() : list.first();
				}
				else {
					slider.addClass('slide-show--left');
					next = active.prev().length>0 ? active.prev() : list.last();
				}
				if(nextItem!==undefined)
					next = list.eq(nextItem);
				next.addClass('slide-show__item--next').one(cssAnimation('animation'), function(){
					next.addClass('slide-show__item--active');
					list.removeClass('slide-show__item--next');
					active.removeClass('slide-show__item--active');
					slider.removeClass('slide-show--left slide-show--right');
				});
				nav.children().removeClass('slide-show__nav--current').eq(next.index()).addClass('slide-show__nav--current');
			});

			slider.append(nav,navNext,navPrev);
			list.filter('.slide-show__item--active').length>0 ?
				nav.children().eq(list.filter('.slide-show__item--active').index()).addClass('slide-show__nav--current'):
				nav.children().first().trigger('click');

			touchX(slider,navNext,navPrev);

		}

		return this.each(setSlider);

	};

// slideShow
	$('.slide-show').slideShow();

// touch X
	function touchX(b,l,r){
		var xStart, yStart, xEnd, yEnd;
		b.on('touchstart touchmove touchend',function(event){
			if (event.type == 'touchstart') {
				xEnd = 0;
				yEnd = 0;
				xStart = parseInt(event.originalEvent.touches[0].clientX);
				yStart = parseInt(event.originalEvent.touches[0].clientY);
			}
			if (event.type == 'touchmove') {
				xEnd = parseInt(event.originalEvent.touches[0].clientX);
				yEnd = parseInt(event.originalEvent.touches[0].clientY);
			}
			if (event.type == 'touchend') {
				if(xEnd == 0) {
					xStart * 2 > windowWidth ?
						l.trigger('click'):
						r.trigger('click');
				}
				else if (Math.abs(xStart - xEnd) > 50 && Math.abs(xStart - xEnd) > Math.abs(yStart - yEnd)) {
					xStart > xEnd ?
						l.trigger('click'):
						r.trigger('click');
				}
			}
		});
	}


// alert_up
	$.fn.alertUp = function(){

		var box = $('.alert_up');
		var windows = box.children();

		box.on('click',function(event){
			var t = $(event.target);
			if(t.is('.alert_up') || t.is('.alert_up__close')){
				box.addClass('alert_up--hide');
				windows.removeClass('alert_up__window--active');
				body.removeClass('hidden');
				$('.frontend').css('margin-left',0);
			}
		});

		showAlertUp = function (selector) {
			var a_up = windows.filter('.alert_up__window--'+selector);
			body.addClass('hidden');
			$('.frontend').css('margin-left',-getScrollBarWidth());
			box.removeClass('alert_up--hide').toggleClass('flexbox',windowHeight > a_up.outerHeight());
			windows.not(a_up).removeClass('alert_up__window--active');
			a_up.addClass('alert_up__window--active').focus();
		}

		return this.each(function(){
			var selector = $(this).attr('data-alert-up');
			$(this).on('click',function(){
				showAlertUp(selector);
			});
		});

	};

	$('.btn-alert_up').alertUp();

// mask
	if($('.mask').length>0){

		$.getScript("/js/jquery.maskedinput.min.js", function(){
			$('.mask').each(function(){
				$(this).mask($(this).attr('data-mask'));
			});
		});

	}

})(jQuery);

function getScrollBarWidth(){
	var div = $('<div class="scroolbarwidth">');
	div.append('<p></p>');
	$('body').append(div);
	var w = div.width() - div.children().width();
	div.remove();
	return w;
}

// cssAnimation('animation/transition')
function cssAnimation(a){var b,c,d=document.createElement("cssanimation");switch(a){case'animation':b={"animation":"animationend","OAnimation":"oAnimationEnd","MozAnimation":"animationend","WebkitAnimation":"webkitAnimationEnd"};break;case'transition':b={"transition":"transitionend","OTransition":"oTransitionEnd","MozTransition":"transitionend","WebkitTransition":"webkitTransitionEnd"}}for(c in b)if(d.style[c]!==undefined)return b[c]};