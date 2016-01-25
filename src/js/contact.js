

function _closeComment(){
	$('#introPage5').animate({opacity:0}, function(){
						$(this).css({'display':'none'});
					});

	//$('.commentTextBox').css({'font-size':'360px'});
	$('.close').css({'displaye':'none'});
}

var textInput = false, textOpen = false, emailInput = false, emailOpen = false;
var maxTextAreaSize = Math.round(2*$(window).height()/3);
function _openComment(){
		
		$('#boxForComment').css({'display':'inherit'});

		var maxTextAreaSize = Math.round(2*$(window).height()/3);
		$('#boxForCommentBody').css({'height':maxTextAreaSize});
		$('.commentTextBox').css({'height':maxTextAreaSize});

		fixTextAreaSize(maxTextAreaSize);

		$(window).keypress(function(e){
			
			

			if(emailOpen === false){
				fixTextAreaSize(maxTextAreaSize);
			}

			//
			// -- Check Email Address

			emailValidation();
			
			// -- Open Close with Email
			if($('.commentTextBox').val().trim().length === 0 && textInput === true){
				textInput = false;
				$('#commentOk').animate({opacity:0.2});
				$('.close').css({'display':'none'});
			}
			if($('.commentTextBox').val().trim().length !== 0 && textInput === false){
				textInput = true;
				$('#commentOk').animate({opacity:1});
				$('.close').css({'display':'inherit'});
			}
			/*if(e.which == 13 && $('.commentTextBox').val().trim().length !== 0) {
		        $('#emailinput').css({'display':'inherit'}).animate({'opacity':'1'});
		        $('#boxForComment').animate({'opacity':'.2'});
		    }*/
			/*console.log();

			console.log(email);

			if($('#emailinput').val()==="" && textInput === true){
				textInput = false;
				$('.boxForCommentFooterContent').animate({'opacity':'.2'});
				$('.close').css({'display':'none'});
			}
			if($('#emailinput').val()!=="" && textInput !== true){
				textInput = true;
				$('.boxForCommentFooterContent').animate({'opacity':'1'});
				$('.close').css({'display':'inherit'});
			}*/

			
		});
		
		$('#emailinput input').bind("change keyup",function(){
			emailValidation();
		});

		$('.close').click(function(){
			_closeComment();
		});

		// check if the user has moved back to main taxt
		$('.commentTextBox').focus(function() {
			
			if(emailOpen === true){
				textOpen = true;
				emailOpen = false;
				$('#boxForComment').animate({'opacity':'1'});
				$('#emailinput').animate({'opacity':'0'}, function(){
					$('#emailinput').css({'display':'none'});
				});
			}
		});
		$('#commentOk').click(function(){
			if(textInput === true){
				$('#emailinput').css({'opacity':'0', 'display':'inherit'}).animate({'opacity':'1'});
				$('#boxForComment').animate({'opacity':'.2'});
			}
		});


		$("#contactForm").submit(function(event){

			/* stop form from submitting normally */
			event.preventDefault();

		    if (emailInput === true) {  // If something was entered

			    /* get some values from elements on the page: */
			    var $form = $( this ), $submit = $form.find( 'button[type="submit"]' ), email_value = $form.find( 'input[name="email"]' ).val(), message_value = $form.find( 'textarea[name="message"]' ).val(), url = $form.attr('action');
			    
			    /* Send the data using post */
			    var posting = $.post( url, {email: email_value, message: message_value});

			    posting.done(function( data ){
			        /* Put the results in a div */
			        $( "#contactResponse" ).html(data);

			        /* Change the button text. */
			        $submit.text('Sent, Thank you');

			        /* Disable the button. */
			        $submit.attr("disabled", true);

			    });

			    $('#introPage5').delay(3600).animate({opacity:0});
				$('#boxForComment').animate({opacity:0}, function(){
					$(this).css({'display':'none'});
					emptyContact();
				});
				$('#emailinput').animate({opacity:0});
			}

		});
		
		
				
		
		/*$('#hoverForComment').css({'display':'inherit'}).animate({'opacity': '0.85'}, function(){
			$('#boxForComment').animate({'left': String(Math.round(_parentWidth/2 - _reviewCommentWidth/2))+'px', 'width':String(_reviewCommentWidth)+'px'}, 200);
			
			$('.boxForCommentFooterContent').mouseover(function(){
				$(this).animate({'opacity':'.5'},100);
			});
			$('.boxForCommentFooterContent').mouseout(function(){
					$(this).animate({'opacity':'1'},300);
			});
			$('.boxForCommentFooterContent').click(function(){
				
				clearInterval(updateTextArea);
				
				$('#boxForComment').animate({'left': String(_parentWidth/2)+'px', 'width':'0px'}, 200, function(){
					$('#hoverForComment').animate({'opacity':'0'});
					$('.reviewContainer').animate({'opacity':'0'});
					$('#iLogo').animate({'height': '112px', 'margin-top': '160px'});	
					$('.headerBackground').animate({'height':'600px'});
					$('#container').animate({'height':'600px'});
					window.parent.$('#PLEYiFrame').animate({ 'height': '700px' }, 'fast');
					$('#iheaderSubTitle').css({'display':'inherit'})
					$('#iheaderTitle').html('THANK YOU!!!')
					$('#container').animate({'opacity':'0'}, function(){
						$('#container').css({'display':'none'});
						location.reload();
					});
				});
			});
		});*/
	}
	
function emailValidation(){

	var email = $('#emailinput input').val();
	console.log( isValidEmailAddress(email));

	if (email !== "" && isValidEmailAddress(email)) {  // If something was entered
		emailInput = true;
		$('#emailSend').stop().animate({'opacity':'1'});
	}else{
		emailInput = false;
		$('#emailSend').stop().animate({'opacity':'0.2'});
	}

}

function fixTextAreaSize(maxTextAreaSize){


	if($('.commentTextBox')[0].scrollHeight >maxTextAreaSize && $('.commentTextBox').css('font-size') === '360px'){
				$('.commentTextBox').css({'font-size':'210px'});
			}else if($('.commentTextBox')[0].scrollHeight >maxTextAreaSize && $('.commentTextBox').css('font-size') === '210px'){
				console.log('BBBBBB');
				$('.commentTextBox').css({'font-size':'96px'});
			}else if($('.commentTextBox')[0].scrollHeight >maxTextAreaSize && $('.commentTextBox').css('font-size') === '96px'){
				console.log('CCCCCC');
				$('.commentTextBox').css({'font-size':'64px'});
			}else if($('.commentTextBox')[0].scrollHeight >maxTextAreaSize && $('.commentTextBox').css('font-size') === '64px'){
				console.log('DDDDDD');
				$('.commentTextBox').css({'font-size':'36px'});
			}else if($('.commentTextBox')[0].scrollHeight >maxTextAreaSize && $('.commentTextBox').css('font-size') === '36px'){
				console.log('EEEEEE');
				$('.commentTextBox').css({'font-size':'18px', 'overflow-y':'scroll'});
			}


			/*if($('.commentTextBox')[0].scrollHeight < maxTextAreaSize && $('.commentTextBox').css('font-size') === '36px'){
				console.log('AAAAAA');
				$('.commentTextBox').css({'font-size':'64px', 'overflow-y':'none'});
			}
			if($('.commentTextBox')[0].scrollHeight < maxTextAreaSize && $('.commentTextBox').css('font-size') === '64px'){
				console.log('BBBBBB');
				$('.commentTextBox').css({'font-size':'96px', 'overflow-y':'none'});
			}
			if($('.commentTextBox')[0].scrollHeight < maxTextAreaSize && $('.commentTextBox').css('font-size') === '96px'){
				console.log('CCCCCC');
				$('.commentTextBox').css({'font-size':'210px', 'overflow-y':'none'});
			}
			if($('.commentTextBox')[0].scrollHeight < maxTextAreaSize && $('.commentTextBox').css('font-size') === '210px'){
				console.log('DDDDDD');
				$('.commentTextBox').css({'font-size':'360px', 'overflow-y':'none'});
			}*/
}

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
};
function emptyContact(){
	$('.commentTextBox').val('');
	$('#emailinput input').val('');
	$('#emailinput').css({'display':'none'});
	
	maxTextAreaSize = Math.round(2*$(window).height()/3);
	textInput = false, textOpen = false, emailInput = false, emailOpen = false;

	$('.boxForComment').css({opacity:1});
	$('#boxForCommentBody').css({'height':maxTextAreaSize});
	$('.commentTextBox').css({'height':maxTextAreaSize, 'font-size':'360px'});
	$('.close').css({'display':'none'});
}
