/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

(function($){

	var btn = $('.calcul__radio-btn-toggle'), // кнопки переключения калькулятора
		btnActive, // активная кнопка
		btnPeriod, // срок начисления процентов (фиксированный или продукты)

		// слайдер суммы
		summ = $('#slider-summ'),
		summMin,
		summMax,
		summStep,
		summValue,

		// слайдер срока
		date = $('#slider-date'),
		dateMin,
		dateMax,
		dateStep,
		dateValue,

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

		// дата суффикс
		dateSufix = dateSet.siblings(".calcul__input-suf"),
		dateSufixArr = dateSufix.attr("data-declension").split(','),

		// % ставка годовых
		stavka,

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

		summSet.val(sepNumber(summValue));
		dateSet.val(dateValue);

		// расчет переплаты
		diffValue = stavka * summValue * dateValue / 100;

		// расчет ппродукта
		if(btnPeriod == 'product') {
			diffValue /= 12;
		}

		// вывели срок займа
		dateSetText.text(dateValue);
		date.children('.ui-slider-handle').text(dateValue);

		// вывели переплату
		returnDiff.text(sepNumber(diffValue));
		// вывели сумму займа
		summSetText.text(sepNumber(summValue));
		summ.children('.ui-slider-handle').text(sepNumber(summValue));
		// вывели сумму возврата
		summSetTotal.text(sepNumber(summValue+diffValue));
		// вывели в месяц
		returnMonth.text(sepNumber(diffValue/dateValue));

		// вывели дату возврата
		var refundDate = new Date();
		refundDate.setDate(refundDate.getDate() + dateValue);
		dateSetTextFormat.text(('0' + refundDate.getDate()).slice(-2) + '.' + ('0' + (refundDate.getMonth() + 1)).slice(-2) + '.' + refundDate.getFullYear());

		// суффикс
		dateSufix.text(declension(dateValue, dateSufixArr))

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
			else if(btnPeriod == "product") {

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