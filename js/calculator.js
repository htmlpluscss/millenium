/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

(function($){

	var btn = $('.calcul__radio-btn-toggle'), // кнопки переключения калькулятора
		btnActive, // активная кнопка
		btnPeriod, // срок начисления процентов (день или год, займ или инвестор соответственно)

		// слайдер суммы
		summ = $('#slider-summ'),
		summMin,
		summMax,
		summStep,
		summValue,
		summPlus = summ.closest('.calcul__box').find('.calcul__plus'),
		summMinus = summ.closest('.calcul__box').find('.calcul__minus'),
		summResult = summ.find('.calcul__result'),

		// слайдер срока
		date = $('#slider-date'),
		dateMin,
		dateMax,
		dateStep,
		dateValue,
		datePlus = date.closest('.calcul__box').find('.calcul__plus'),
		dateMinus = date.closest('.calcul__box').find('.calcul__minus'),
		dateResult = date.find('.calcul__result'),

		// сумма займа
		summSet = $("#summ-set"),
		summSetText = $(".summ-set"),
		// сумма возврата вывод
		summSetTotal = $(".summ-return"),

		// срок займа
		dateSet = $("#date-set"),
		// срок возврата вывод
		dateSetText = $(".date-set"),
		// дата возврата
		dateSetTextFormat = $(".date-set-format"),

		// % ставка годовых
		rateSet = $("#rate-set"),
		stavka,

		// % ставка плавающая
		stavkaArr,

		// продукты
		productBtns = $('.calcul__product'),
		// продукты (дата и процент)
		setDateStavka = $('.calcul__set-radio'),

		// cтавка вывод
		stavkaText = $('.calcul__stavka'),

		// сумма переплаты
		diffValue,

		// сумма переплаты вывод
		returnDiff = $('.return-diff'),

		// сумма переплаты в месяц
		returnMonth = $('.summ-set-month'),

		// произведение минимального срока и суммы
		minSummDate,
		// произведение максимального срока и суммы
		maxSummDate,
		// блок изменяющий высоту от дохода
		diffHeight = $('.calcul__diff-height'),
		diffHeightMin = diffHeight.height(),
		diffHeightMax = diffHeight.closest('.calcul__diff-height-max').height(),

		resizeTimeoutId;


	function result(){

		// изменяем исходные значения
		btnActive.attr('data-summ-value',summValue);
		btnActive.attr('data-date-value',dateValue);
		btnActive.attr('data-rate-value',stavka);

		// забиваем значения
		summValue = parseInt(summValue);
		dateValue = parseInt(dateValue);
		rateValue = parseFloat(stavka);

		summSet.val(summValue);
		dateSet.val(dateValue);
		rateSet.val(rateValue);

		// расчет переплаты
		diffValue = stavka * summValue * dateValue / 100;

		// расчет ппродукта
		if(btnPeriod == 'product') {
			diffValue /= 12;
		}

		// расчет переплаты инвестора
		if(btnPeriod == '365') {
/*
			for(var i = 0; i < stavkaArr.length; i++){
				var v = stavkaArr[i].split('|');
				if(dateValue >= parseInt(v[0])){
					stavka = parseInt(v[1]);
					stavkaText.text(stavka);
					stavka /= 12;
				}
				else{
					break;
				}
			}

*/		};


		// вывели срок займа
		dateSetText.text(dateValue);
		// вывели переплату
		returnDiff.text(sepNumber(diffValue));
		// вывели сумму займа
		summSetText.text(sepNumber(summValue));
		// вывели сумму возврата
		summSetTotal.text(sepNumber(summValue+diffValue));
		// вывели в месяц
		returnMonth.text(sepNumber(diffValue/dateValue));

		// вывели дату возврата
		var refundDate = new Date();
		refundDate.setDate(refundDate.getDate() + dateValue);
		dateSetTextFormat.text(('0' + refundDate.getDate()).slice(-2) + '.' + ('0' + (refundDate.getMonth() + 1)).slice(-2) + '.' + refundDate.getFullYear());

		// позиционирование плавающих блоков
		summResult.css('margin-left',-summResult.outerWidth()/2);
		dateResult.css('margin-left',-dateResult.outerWidth()/2);

		// высота блока зависищая от дохода
	 	diffHeight.height((diffHeightMax - diffHeightMin) * (summValue * dateValue - minSummDate) / (maxSummDate - minSummDate) + diffHeightMin);

	}

	// склонение
	function declension(num, expressions) {
		var r;
		var count = num % 100;
		if (count > 4 && count < 21)
			r = expressions['2'];
		else {
			count = count % 10;
			if (count == 1)
				r = expressions['0'];
			else if (count > 1 && count < 5)
				r = expressions['1'];
			else
				r = expressions['2'];
		}
		return r;
	}
	// отделяем тысячи
	function sepNumber(str){
		str = parseInt(str).toString();
		return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	}
	// склеиваем тысячи
	function strToNumber(n){
		return parseInt(n.replace(/\s+/g,''));
	}

	// продукты
	setDateStavka.on('change', function(event,start) {
		var v = $(this).val().split('|');
		dateValue = parseInt(v[0]);
		stavka = parseInt(v[1]);
		if(start === undefined){
			result();
		}
	});

	// выбор типа калькулятора
	btn.on('change',function(){
		btnActive = $(this),
		setSlider(true);
	}).filter(':checked').trigger('change');

	// перестроить слайдер
	$(window).on('resize', function(){
		clearTimeout(resizeTimeoutId);
		resizeTimeoutId = setTimeout(function(){
			setSlider(false);
		}, 1000);
	});

	// + - один пункт
	summPlus.on('click',function(){
		summSet.val(summValue + summStep).trigger('blur');
	});
	summMinus.on('click',function(){
		summSet.val(summValue - summStep).trigger('blur');
	});
	datePlus.on('click',function(){
		dateSet.val(dateValue + dateStep).trigger('blur');
	});
	dateMinus.on('click',function(){
		dateSet.val(dateValue - dateStep).trigger('blur');
	});

	function setSlider(resetSlider){

		// парсим данные
		if(resetSlider) {

			summMin = parseInt(btnActive.attr('data-summ-min'));
			summMax = parseInt(btnActive.attr('data-summ-max'));
			summStep = parseInt(btnActive.attr('data-summ-step'));
			summValue = parseInt(btnActive.attr('data-summ-value'));

			dateMin = parseInt(btnActive.attr('data-date-min'));
			dateMax = parseInt(btnActive.attr('data-date-max'));
			dateStep = parseInt(btnActive.attr('data-date-step'));
			dateValue = parseInt(btnActive.attr('data-date-value'));

			stavka = btnActive.attr('data-stavka');

			btnPeriod = btnActive.attr('data-period');
			minSummDate = summMin * dateMin;
			maxSummDate = summMax * dateMax;

			// фиксирванная
			if(btnPeriod == '1') {
				stavkaText.text(stavka.replace('.',','));
				stavka = parseFloat(stavka);
			}
			else if(btnPeriod == "365") {
//				stavkaArr = stavka.split(',');
			}
			else if(btnPeriod == "product") {
				productBtns.addClass('hide').filter('.'+stavka).removeClass('hide').find(':checked').trigger('change','start');
			}

			// смена валют
			var currencyText = btnActive.attr('data-currency-text');
			var currencySymbol = btnActive.attr('data-currency-symbol');
			if(currencyText !== undefined){
				$('.calcul__currency-text').text(currencyText);
				$('.calcul__currency-symbol').text(currencySymbol);
			}

		}

		// нижнии крайние значения
		$('.calcul__summ-min').text(sepNumber(summMin));
		$('.calcul__summ-max').text(sepNumber(summMax));
		$('.calcul__date-min').text(dateMin);
		$('.calcul__date-max').text(dateMax);

		// инициализация слайдеров
		if(resetSlider) {

			summ.slider({
				range: 'min',
				min: summMin,
				max: summMax,
				step: summStep,
				value: summValue,
				create: function(){
					summ.find('.ui-slider-handle').html(summResult);
				},
				slide: function(event,ui) {
					summValue = ui.value;
					result();
				}
			});

			date.slider({
				range: 'min',
				min: dateMin,
				max: dateMax,
				step: dateStep,
				value: dateValue,
				create: function(){
					date.find('.ui-slider-handle').html(dateResult);
				},
				slide: function(event,ui) {
					dateValue = ui.value;
					result();
				}
			});

		}

		result();

	}

	// ввод суммы и даты в инпуте
	summSet.add(dateSet).on('change keydown blur', function(event) {
		if (event.keyCode == 13) {
			$(this).trigger('blur');
		}
		if (event.type == 'blur') {
			var v = this.value;
			if (v.match(/[^0-9]/g))
				v = v.replace(/[^0-9]/g, '');
			if($(this).is('#summ-set')){
				if(v>summMax)
					v = summMax;
				if(v<summMin)
					v = summMin;
				summValue = v;
				summ.slider('value',v);
			}
			else {
				if(v>dateMax)
					v = dateMax;
				if(v<dateMin)
					v = dateMin;
				var arithmetic = (v - dateMin) % dateStep;
				if (arithmetic > 0){
					v = parseInt((v - dateMin) / dateStep) * dateStep + dateMin;
					if (arithmetic * 2 > dateStep){
						v += dateStep;
					}
				}
				dateValue = v;
				date.slider('value',v);
			}
			result();
		}
	});

})(jQuery);