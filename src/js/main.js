function restart() {
	// Clear all data
	localStorage.clear();
	// load step 0
	loadStep(0);
}

function removeToasts(callback) {
    $('.toast').remove();
}

function createToast(message, callback) {
    //Clean Previous Toasts
    removeToasts();

    var mess = message ? message : 'Ooops try again later.';
    $('body').append('<div class="toast" style="position: fixed;opacity: 0;left: 50%;transform: translateX(-50%);top: -200px; padding: 16px;background-color: rgb(39, 16, 33);color: #fff;border-radius: 3px;">' + mess + '</div>');
    $('.toast').animate({
        top: '20px',
        opacity: '1'
    }, "slow").delay(3000).animate({
        top: '-200px',
        opacity: '0'
    }, "slow", function() { removeToasts(callback) });
}

function removeModals(callback) {
	$('.modal__overlay').fadeOut();
	$('.modal__wrapper').fadeOut();
	setTimeout(function(){
		$('.modal__overlay').remove();
		$('.modal__wrapper').remove();
	}, 400)
}

function createModal(message, callback) {
    var mess = message ? message : 'Ooops try again later.';
    $('body').append('<div class="modal__overlay"></div><div class="modal__wrapper" style="opacity: 0;"><div class="modal__body" style="background-color: #fff;color: #000;border-radius: 3px;"><span class="modal__close"><svg width="20" height="20"><use xlink:href="#icon__close"></use></svg></span><div class="modal__content">' + mess + '</div></div></div>');
	$('.modal__wrapper').animate({opacity: 1}, 'slow');
}

function copyCode(text) {
	// console.log(text, 'Copied!');
	navigator.clipboard.writeText(text).then(() => {
	  /* Resolved - text copied to clipboard */
	  createToast('Código de descuento copiado.', 'goBack');
	},() => {
		/* Rejected - clipboard failed */
		createToast('Error al copiar al portapapeles.', 'goBack');
	});
}

// CountDown Ends
function liftOff() {
	const expiredMarkup = `<div class="form__counter--expired-wrapper"><span>Código caducado.</span> <span class="fn-restart button--link">Reiniciar</span></div>`;
	$('.form__counter').addClass('form__counter--expired');
	$('.form__counter--counter').html(expiredMarkup);
}

function createCounter() {
	// Destroy previous counters if any
	$('.form__counter--counter').countdown('destroy');
	$('.form__counter').removeClass('form__counter--expired');

	var targetDate = new Date( parseInt(localStorage.getItem('dateCreationCode')) );
	targetDate.setMinutes(targetDate.getMinutes() + 20);

	// console.log('CREATING COUNTER, ', targetDate);

	$('.form__counter--counter').countdown({until: targetDate, compact: true,
		layout: '<b class="form__counter--clock">{mnn}{sep}{snn}</b>', onExpiry: liftOff, alwaysExpire: true});
}

function loadNextStep(step) {

	// For persistency.. ¿Use cookies, localStorage or params... I have decided localStorage.
	var currentStep = localStorage.getItem('lastStep') ? parseInt(localStorage.getItem('lastStep')) : 0;

	if (currentStep == 0) {
		// Store the step1 information
		var step1Value = $('.form').find('.fn-step-' + (currentStep + 1) + ' .form__radio--button--active').attr('data-value');

		// Store current step as last for reloads
		localStorage.setItem('lastStep', currentStep + 1);

		// Store current step value
		localStorage.setItem( 'step1', step1Value);

		// Jump to next Step
		loadStep(currentStep + 1);

	} else if (currentStep == 1) {
		// Store step2 information
		var step2Value = $('.form').find('.fn-step-' + (currentStep + 1) + ' .form__radio--button--active').attr('data-value');

		// Store current step as last for reloads
		localStorage.setItem('lastStep', currentStep + 1);

		// Store current step value
		localStorage.setItem('step2', step2Value);

		// create the code and store it
		var firstDigit = localStorage.getItem('step1').charAt(2);
		var secondDigit = localStorage.getItem('step1').charAt(3);
		var codeNumber = (parseInt(firstDigit) + parseInt(secondDigit)).toString();

		// Remove letter A non case sensitive and spaces first
		const regex = /a|\s/gi;
		var formattedTextCode = localStorage.getItem('step2').replace(regex, '').toUpperCase();
		var codeText = formattedTextCode.slice(-4);

		// Concat the generated number and the text to create the code
		var formattedCode = codeNumber.concat(codeText);

		// Store the code
		localStorage.setItem('promocode', formattedCode);

		// Create the timeStamp
		var dateCreationCode = Date.now();
		// Store the timeStamp
		localStorage.setItem('dateCreationCode', dateCreationCode);

		// console.log('Code ', formattedCode, ' and timestamp: ', dateCreationCode);

		// Jump to next Step
		loadStep(currentStep + 1);
	}
}

function loadStep(step) {

	var currentStep = step ? step : 0;
	// console.log('We have loaded the step: ', currentStep);

	var step2Value = localStorage.getItem('promocode');

	const $mainParent = $('.form');
	const $pageTitle = $('.fn-pageTitle');
	const $pageBadge = $('.fn-pageBadge');
	const $pageParagraph = $('.fn-pageParagraph');
	const $paneTitle = $('.fn-paneTitle');
	const $buttonText = $('.fn-buttonSubmit .form__button--text');
	const $codeText = $('.fn-codeText');

	var pageTitle = '';
	var pageBadge = '';
	var pageParagraph = '';
	var paneTitle = '';
	var buttonText = '';
	var buttonURL = 'https://www.siroko.com/';

	if (currentStep <= 3) {
		// Set all for next clicks
		$mainParent.attr('data-currentstep', parseInt(currentStep) + 1);
		// $('body').attr('data-currentstep', parseInt(currentStep) + 1);
	}

	// Handle the Page elements content
	switch (parseInt(currentStep)) {
		case 1:
			pageTitle = 'Vamos, una más';
			pageBadge = 'Paso 2 de 2';
			pageParagraph = '';
			paneTitle = 'Por unas gafas Siroko, yo...';
			buttonText = 'Siguiente';

			break;
		case 2:
			pageTitle = '¡Enhorabuena!';
			pageBadge = 'Tu premio está listo';
			pageParagraph = '';
			paneTitle = 'Lo Prometido es deuda';
			buttonText = 'Ir a siroko.com';

			break;
		default:
			pageTitle = '¡Vamos allá!';
			pageBadge = 'Paso 1 de 2';
			pageParagraph = 'Has llegado hasta el test de Siroko. Responde las siguientes preguntas y genera tu código de premiado a medida.';
			paneTitle = 'Por unas gafas Siroko, yo...';
			buttonText = 'Siguiente';
	}

	// Set the Step Content
	$pageTitle.html(pageTitle);
	$pageBadge.html(pageBadge);
	$pageParagraph.html(pageParagraph);
	$paneTitle.html(paneTitle);
	$buttonText.html(buttonText);
	$codeText.html(step2Value).attr('data-code', step2Value);

	// Start the counter for step 2
	if (currentStep == 2) {
		createCounter();
	}

	// Hide the current Step and display next step
	if (currentStep > 0) {
		// use animations
		$mainParent.find('div[class*="fn-step-"]').fadeOut();
		setTimeout(function(){
			$mainParent.find('.fn-step-' + (parseInt(currentStep) + 1) ).fadeIn();
		}, 400);
	} else if (currentStep == 0) {
		// prevent animations
		$mainParent.find('div[class*="fn-step-"]').hide();
		$mainParent.find('.fn-step-' + (parseInt(currentStep) + 1) ).show();
	}
}

$(document).ready(function(){

	// load last step completed
	localStorage.getItem('lastStep') ? loadStep( localStorage.getItem('lastStep') ) : loadStep(0);

	$(document).on('click', '.fn-buttonCopy', function(){
		var code = $(this).closest('.form__code').find('.form__code--text').attr('data-code');
		copyCode(code);
	});

	$(document).on('click', '.form__radio--button', function(){
		$(this).parent().find('.form__radio--button').removeClass('form__radio--button--active');
		$(this).addClass('form__radio--button--active');
	});

	$(document).on('click', '.fn-buttonSubmit', function(){
		if ( $('.form').attr('data-currentStep') == '3' ) {
			location.href='https://www.siroko.com/';
		} else {
			loadNextStep();
		}
	});
	$(document).on('click', '.fn-restart', function(){
		restart();
	});

	// Modals
	var sampleModal = `<h1>Bases</h1><p>By copying, installing or otherwise using Python, Licensee agrees to defend and indemnify every Contributor for any liability in the Work and any licenses granted by Participant to You a world-wide, royalty-free, non-exclusive license, to the intellectual property claims, each Contributor hereby grants Licensee a non-exclusive, worldwide, royalty-free patent license is intended to guarantee your freedom to re-use and re-distribute applies to "Community Portal Server" and related software products as well as conditions under which a Package if it has not been modified, or has been modified in accordance with FAR 12.211 (Technical Data) and 12.212 (Computer Software) and, for Department of Defense purchases, DFAR 252.227-7015 (Technical Data -- Commercial Items) and 227.7202-3 (Rights in Commercial Computer Software Documentation). Accordingly, all U.S. Government End Users acquire Covered Code under the GNU General Public Licenses are designed to make such provision valid and enforceable.</p><img src="https://picsum.photos/200/300" style="margin: 0 auto;display: block;max-width:100%;"/><p>The Agreement Steward to a jury trial in any derivative work that is different from this software and its documentation for the display of characters in the Covered Code created under this License. The Free Software Foundation. If the Work accessible by file transfer protocols such as lost profits; states that any persons, including (but not limited to software (including a cross-claim or counterclaim in a lawsuit), then any patent Licensable by Contributor, to make, use, sell, offer for sale, have made, use, offer to sell, sell, import, and otherwise transfer the Contribution causes such combination to be attributed in any derivative works.</p><p>Therefore, for any purpose and without further action by the Current Maintainer must become or remain the Current Maintainer of the Agreement will automatically terminate at the time the Contribution and the year the work (an example is provided in the future. PDF file or other work which Apple Computer, Inc. All Rights Reserved" are retained in the page history to retrieve content published before that date to ensure that your Modified Version available to Licensee on an equitable basis.</p>`;

	$(document).on('click', '.modal__close', function(){
		removeModals();
	});

	// And modal trigger
	$(document).on('click', '.fn-modal', function(e){
		createModal(sampleModal);
	});
	// Test Modal
})