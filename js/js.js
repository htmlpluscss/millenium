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

// datepicker

	$(".datepicker").each(function(){

		var t = $(this)

		if(t.hasClass('datepicker--interaction')){

			var upcomingEvents = $('.upcoming-events__item');
			var upcomingEventsDate = [];
			upcomingEvents.find('.upcoming-events__date').each(function(){
				upcomingEventsDate.push($(this).attr('datetime'));
			});

			t.datepicker({
				firstDay: 1,
				dateFormat: 'yy-mm-dd',
				showOtherMonths: true,
				dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				beforeShowDay: function(date){
					var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
					return [ upcomingEventsDate.indexOf(string) != -1 ]
				},
				onChangeMonthYear: function(year, month, inst) {
					console.log(year)
					console.log(month)
				},
				onSelect: function(dateText, inst) {
					var nextItem = upcomingEventsDate.indexOf(dateText);
					upcomingEvents.removeClass('slide-show__item--active');
					nextItem = upcomingEvents.eq(nextItem).addClass('slide-show__item--active');
					nextItem.parent().css('left',-nextItem.position().left);
				}
			});

		}

		if(t.hasClass('datepicker--links')){

			var upcomingEventsDate = ['2016-10-13','2016-11-12','2016-12-02'];

			t.datepicker({
				firstDay: 1,
				dateFormat: 'yy-mm-dd',
				showOtherMonths: true,
				dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
				beforeShowDay: function(date){
					var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
					return [ upcomingEventsDate.indexOf(string) != -1 ]
				},
				onSelect: function(dateText, inst) {
					alert(dateText);
				}
			});

		};

	});


// slideShow

	$.fn.slideShow = function(){

		var setSlider = function(){

			var slider = $(this),
				list = slider.find('.slide-show__item'),
				size = list.length,
				navNext = $('<a class="slide-show__next">'),
				navPrev = $('<a class="slide-show__prev">'),
				abscissa = slider.hasClass('slide-show--abscissa'),
				transition = false,
				interactionCalendar = slider.hasClass('slide-show--calendar');

			navNext.add(navPrev).on('click',function(event,nextItemIndex){
				if(transition) {
					return true;
				}
				transition = true;

				var clickRight = $(this).hasClass('slide-show__next');
				var activeItem = list.filter('.slide-show__item--active');
				var nextItem = clickRight ? activeItem.next() : activeItem.prev();

				if(abscissa) {

					if(interactionCalendar){

						if(nextItem.length == 0){
							nextItem = clickRight ? list.first() : list.last();
						}

						var date = nextItem.find('.upcoming-events__date').attr('datetime');
						$("#datepicker").datepicker("setDate", date);

					}
					if(!clickRight && nextItem.length == 0){
						jump(size);
						setTimeout(function(){
							transition = false;
							navPrev.trigger('click');
						},1);
						return true;
					}
					nextActive(nextItem);
					ul.removeClass('slide-show__ul--jump').css('left',-nextItem.position().left).one(cssAnimation('transition'), function(){
						if(clickRight && nextItem.index() > size){
							jump(nextItem.index() - size);
						}
						transition = false;
					});

				} else {

					if(clickRight){
						slider.addClass('slide-show--right');
						if(nextItem.length == 0){
							nextItem = list.first();
						}
					}
					else {
						slider.addClass('slide-show--left');
						if(nextItem.length == 0){
							nextItem = list.last();
						}
					}
					if(nextItemIndex !== undefined)
						nextItem = list.eq(nextItemIndex);
					nextItem.addClass('slide-show__item--next').one(cssAnimation('animation'), function(){
						nextActive(nextItem);
						list.removeClass('slide-show__item--next');
						slider.removeClass('slide-show--left slide-show--right');
						transition = false;
					});
					navDisk.removeClass('slide-show__nav--current').eq(nextItem.index()).addClass('slide-show__nav--current');

				}
			}).hover(function(){
				slider.addClass('notsel');
			},function(){
				slider.removeClass('notsel');
			});

			if(abscissa) {

// проверяю кол-во элементов
				if(parseInt(slider.attr('data-item-show')) >= size){
					slider.addClass('slide-show--disabled');
					transition = true;
				}
				else {

					slider.removeClass('slide-show--disabled');

					var ul = slider.find('.slide-show__ul');
					if(slider.hasClass('slide-show--carousel')){
						ul.append(list.clone());
					}
					list = ul.children();

					if (list.filter('.slide-show__item--active').length>0) {
						ul.css('left',-list.filter('.slide-show__item--active').position().left);
					}
					else {
						list.first().addClass('slide-show__item--active');
					}

				}

			} else {

				var nav = $('<div class="slide-show__nav">');
				for(var i = 0; i < size; i++){
					nav.append('<a></a>');
				}
				var navDisk = nav.children();

				navDisk.on('click',function(){
					if($(this).hasClass('slide-show__nav--current')) {
						return true;
					}
					var index = $(this).index();
					var btnClick = index > list.filter('.slide-show__item--active').index() ? navNext : navPrev;
					btnClick.trigger('click',index);
				});

				list.filter('.slide-show__item--active').length > 0 ?
					navDisk.eq(list.filter('.slide-show__item--active').index()).addClass('slide-show__nav--current') :
					navDisk.first().trigger('click');

				touchX(slider,navNext,navPrev);
				slider.append(nav);

			}

			slider.append(navNext,navPrev);

			function nextActive(n){
				n.addClass('slide-show__item--active').siblings().removeClass('slide-show__item--active');
			}

			function jump(indexNext){
				n = list.eq(indexNext);
				l = n.position().left;
				ul.addClass('slide-show__ul--jump').css('left',-l);
				nextActive(n);
			}

			function timer(time){
				var intervalID;
				function on_timer(){
					intervalID = setInterval(function(){
						if(!$('#header').hasClass('header--menu-show')){
							navNext.triggerHandler('click');
						}
					},time * 1000);
				}
				slider.hover(function(){
					clearInterval(intervalID);
				},function(){
					on_timer();
				});
				on_timer();
			}
			if(slider.is('[data-timer]')){
				timer(parseInt(slider.attr('data-timer')));
			}

		}

		return this.each(setSlider);

	};

	$('.slide-show').slideShow();


// slider-preview
	$('.slider-preview__preview img').on('click',function(){
		var src = $(this).attr('src');
		$('.slider-preview__box').css('background-image','url('+src+')');
	});

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

// ready
	$window.ready(function(){
		$window.trigger('resize');
		$('.frontend').addClass('frontend--ready');
	});

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
			box.removeClass('alert_up--hide').toggleClass('alert_up--flexbox',windowHeight > a_up.outerHeight());
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

// img-hover-filter
	$('.event-hover__item').hover(function(){
		$(this).closest('.event-hover').addClass('event-hover--hover');
	},function(){
		$(this).closest('.event-hover').removeClass('event-hover--hover');
	});

// select

	$.fn.mySelect = function(){

		var select = function(){

			var select = $(this);
			select.wrap('<div class="select notsel">');
			var select_box = select.parent();
			var c = '<span class="select__value"><span class="select__text"></span></span><div class="select__box"><ul>';
			select.children('option').each(function() {
				if($(this).val()!='none')
					c += '<li class="select__li" data-value="' + $(this).val() + '">' + $(this).text() + '</li>';
			});
			c += '</ul></div>';
			select.before(c);

			var box_ul = select.siblings('.select__box');
			var visible = select.siblings('.select__value').children();

			select_box.on('click', function() {
				select_box.hasClass('select--focus') ? box_ul.hide() : box_ul.show();
				select_box.toggleClass('select--focus');
			});

			box_ul.on('click','.select__li', function() {
				select.val($(this).attr('data-value')).trigger('change');
			});
			select.on('change',function(){
				var o = select.children(':selected');
				visible.text(o.text());
				o.attr('value')=='none' ? select_box.addClass('select--default') : select_box.removeClass('select--default');
			}).trigger('change');

		}

		$(document).on('click', function(event) {
			$('.select--focus').not($(event.target).closest('.select')).removeClass('select--focus').find('.select__box').hide();
		});

		return this.each(select);

	};

	$('select').mySelect();

// accordion
	$('.accordion__toggle').on('click', function(event) {
		$(this).hasClass('accordion__toggle--active') ?
			$(this).removeClass('accordion__toggle--active').next().stop().slideUp() :
			$(this).addClass('accordion__toggle--active').next().stop().slideDown();
	});

// fancy
	if($('.fancy').length>0){

		$.getScript('/js/jquery.fancybox.pack.js', function(){
			$('.fancy').fancybox({
				padding : 50
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