
var _$heroCounter = 0,
	_$pastHeroCounter = 0;
var _$heroCount = 5;


var _$projectIsOpened = false;
// -- Check filter status
var _$filterIsOpened = false;

// -- Image Sizes
var _$maximumThumbSize = 600;
var _$imageGapPercentage = 0.04;




/*
	Document is loaded
*/
$( document ).ready(function() {

	// If previous domain includes same domain
    if(document.referrer.split('/')[2] != location.href.split('/')[2] && window.history == ""){
		// -- Make the preloading slide visible
		$('#preloadingContainer').removeClass('closed').addClass('opened');
	}

	if(_$isMobile){
		_$maximumThumbSize = 450;
		_$imageGapPercentage = 0.04;
	}

});
	
/*
	Runs after the data is loaded and after angular is ran
*/
function _PerPageJustLoaded(){


	/*
		Animating Projects to align sizes and locations
	*/


	/*
		Adding Interactions Specific For This Page
	*/

	// -- Filter Button
	$('.svg-wrapper').click(function(event) {
		if (!_$filterIsOpened) {
			_OpenFilter();
		} else {
			_CloseFilter();
		}
		$(this).toggleClass('open');
	});
}


/*
	Filter Control
*/

// -- Open Filter Overlay
function _OpenFilter(){
	_$filterIsOpened = true;

	// turn on the filter tag
	$('.filterOverlay').removeClass('filterClosed').addClass('filterOpened');
	$('.filterTexts, #_headerCategoryMenu, #_headerRoleMenu, #_headerSoftMenu').removeClass('filterClosedDisappear filterClosed').addClass('filterOpenedAppear filterOpened');

}

// -- Close Filter Overlay
function _CloseFilter(){
	_$filterIsOpened = false;

	$('.filterOverlay').removeClass('filterOpened').addClass('filterClosed');
	$('.filterTexts, #_headerCategoryMenu, #_headerRoleMenu, #_headerSoftMenu').removeClass('filterOpenedAppear filterOpened').addClass('filterClosed filterClosedDisappear');
}


/*
	Preloading Control
*/


/*function _CreatePreloadingSlide(){
	var w = 0;

	// -- Slowly animate slider
	function animateSlide(){
	
		if(w < $(window).width()){
			w += Math.random()* 600 + 20;
			$('#preloadingSlide').animate(
				{left:w}, 
				Math.random()*800+200, 
				function(){ animateSlide(); }
			);
			
		}else{
			$('#preloadingContainer').css({'display':'none'});
			_GRID_OpenProjects(1);
		}

	}

	setTimeout(function() {
		$('.heroProject').addClass('opened');
	}, 1500);
	

	animateSlide();
}*/

//////////////////////////



var scrollon = false;

var initialPos = 0;
var animateSetTimeOut;

var goalPosY1 = 0,
	goalPosY2 = 0,
	goalPosY3 = 0,
	goalPosY4 = 0;

var scrollInterval = 5;

// --  Measure if scroll is stuck at bottom

var _$lasctScrollDelta = 0;

$(document).ready(function() {

	// check cookie
	var visited = $.cookie("visited")
	if ($.cookie("visited") != 'yes') {
		$.cookie('visited', 'yes');
		isFirstTime = true;
	}

	// set cookie
	$.cookie('visited', 'yes', { expires: 1, path: '/' });


	// General Hover Animation
	if(!_$isMobile) {
		$('.hover').hover(
			function(){
				$(this).addClass('hovered');
			},
			function(){
				$(this).removeClass('hovered');
			}

	    );
	}

	$('.goToAllProject').click(function(event) {
		_GRID_OpenImmediately();
	});
	
});



function perPageUpSwipe(){

	_HERO_MoveNext();
	_$bAnimation =  false;

}
function perPageDownSwipe(){

	_HERO_MovePrev();
	_$bAnimation =  false;

}

var TO_scroll;

function movePage() {

	// If the speed is slowing down, ignore. The scrollpad has elastic.
	// Scroll Up
	if (_$scrollDirection < (-1 * _$scrollInterval)) {
		
		_HERO_MoveNext();

	}else if (_$scrollDirection > _$scrollInterval) {

		_HERO_MovePrev();
	
	}else{
		if(_$bAnimation === true){
			_ScrollTimeOut(0);
		}
	}

	_HERO_ApplyScroll();

}

/*
	Pause the scrolling
*/
function _ScrollTimeOut(n){


	var delayTime = 1000;
	if(n!=0)
		delayTime = n;

	clearTimeout( TO_scroll );
	TO_scroll = setTimeout(function() {
		_$bAnimation = false;
	}, delayTime);
}


/*
	HERO Moves to NEXT
*/
function _HERO_MoveNext(){

	if(_$heroCounter < (_$heroCount+1) && _$bAnimation == true){
		_$heroCounter += 1;
			
		if(_$heroCounter < _$heroCount){
			location.hash = _$heroCounter+1;
		}else{
			if (_currentSort == null)
				location.hash = 'all';
			else
				location.hash = _currentSort;
		}

		_ScrollTimeOut(0);

		_HERO_ApplyScroll();
	}else{
		_ScrollTimeOut(0);
	}
}


/*
	HERO Moves to PREVIOUS
*/
function _HERO_MovePrev(){
	
	if(_$heroCounter > 0 && _$bAnimation == true){

		// If the page is showing the grid, make sure to return unless if the scroll position is at the top of the container.
		if(_$heroCounter >= _$heroCount && $('#projectContainer').scrollTop() > 0){
			return;
		}

		_$heroCounter -= 1;
			
		if(_$heroCounter < _$heroCount){
			location.hash = _$heroCounter+1;
		}else{

		}

		_ScrollTimeOut(0);

		_HERO_ApplyScroll();
	}else{
		_ScrollTimeOut(0);
	}
}

/*
	HERO Apply Changed Herocounter to the page
*/
function _HERO_ApplyScroll(){

	/* LOAD GRID */
	if (_$heroCounter > _$heroCount-1) {

		if (projecton === false) {
			
			projecton = true;
			scrollInterval = 100;

			// Calling Grid Open Project Function
			_GRID_OpenProjects(1);

		}

	}


	// ------- HERO ------- //
	// Try Animate the Hero Projects
	_HERO_AdjustProject();

}


var projecton = false;
var projectscrollable = false;
var projectcandispatchUp = true;

var containerBasePos = 0;

// height and width of the project
var _$projectWidth = 0;
var _$projectHeight = 0;

var projectPos = [];

var projectContainerHeight;


function _CreateAnimationAndEventsToProjects() {


	adjustSize_perPage();

	for (var i = 0; i < _$projects.length; i++) {
		
		/*
			Applying the initial positioning when 
		*/
		$('#project' + _$projects[i].id).css({
			'width': _$projectWidth,
			'height': _$projectHeight,
			'top': projectPos[i].top,
			'left': projectPos[i].left,
			'-webkit-transform': 	'scale(0,0)',
			'-moz-transform': 		'scale(0,0)',
			'-ms-transform': 		'scale(0,0)',
			'-o-transform': 		'scale(0,0)',
			'transform': 			'scale(0,0)'
		});

		/*
			Hover Event
		*/
		if (!_$isMobile) {

			$('#project' + _$projects[i].id).mouseenter(function(event) {

				_OpenProjectTitleHover($(this), event);
				
			}).mouseover(function(event) {
                
                _OpenProjectTitleHover($(this), event);

            }).mouseleave(function(event) {
				$(this).find('.img-container img').removeClass('opened').addClass('closed');
				$(this).find('.img-over-caption').removeClass('opened').addClass('closed');


				// -- Check Where mouse exited from
				var tempX = event.pageX - $(this).offset().left;
				var tempY = event.pageY - $(this).offset().top;
				var halfSize = $(this).width() / 2;
				if (tempX < 0)
					HoverOutFromLeft($(this));
				else if (tempX > $(this).width())
					HoverOutFromRight($(this));
				else if (tempY < 0)
					HoverOutFromTop($(this));
				else
					HoverOutFromBottom($(this));
				// -- Check Where mouse exited from

			});


			function _OpenProjectTitleHover(Elm, Evnt){

				Elm.find('.img-container img').removeClass('closed').addClass('opened');
				Elm.find('.img-over-caption').removeClass('closed').addClass('opened');

				// -- Check Where mouse entered from
				var tempX = Evnt.pageX - Elm.offset().left;
				var tempY = Evnt.pageY - Elm.offset().top;
				var halfSize = Elm.width() / 2;
				if (halfSize > tempX) {
					if (halfSize > tempY) {
						if (tempX > tempY)
							HoverInFromTop(Elm);
						else
							HoverInFromLeft(Elm);
					} else {
						if (tempX > Elm.width() - tempY)
							HoverInFromBottom(Elm);
						else
							HoverInFromLeft(Elm);
					}
				} else {
					if (halfSize > tempY) {
						if (Elm.width() - tempX > tempY)
							HoverInFromTop(Elm);
						else
							HoverInFromRight(Elm);
					} else {
						if (Elm.width() - tempX > Elm.width() - tempY)
							HoverInFromBottom(Elm);
						else
							HoverInFromRight(Elm);
					}

				}
				// -- Check Where mouse entered from
			}
		}else{

			// If it's mobile, completely remove GIF secondary image
			$('.secondary').css({'display':'none'});

		}
		
		/*
			Clicking a project
		*/
		$('#project' + _$projects[i].id).click(function(event) {
			
			// -- Call a function to animate before location is called;
			_OpenProjectPage($(this).data('nameid'));

			// -- Removing the hover animation
			$(this).find('.img-container').removeClass('opened').addClass('closed');
			$(this).find('.img-over-caption').removeClass('opened').addClass('closed');
			RemoveAllClassForHover($(this));
		});


	}

	$('footer').css({ 'top': (projectContainerHeight) });


	// Skip if URL has is not empty
	if (window.location.hash.replace("#", "") != "" || _$isMobile){
		_CheckMySortFromURL();
	}


	
}




/*

	Open GRID

*/


function _GRID_OpenImmediately(){
	_$heroCounter = _$heroCount+1;

	// Update URL
	if (_currentSort == null)
		location.hash = 'all';
	else
		location.hash = _currentSort;

	adjustSize_perPage();
	_GRID_OpenProjects(1);

}

function _GRID_OpenProjects(d) {

	$('.svg-wrapper').addClass('loaded');
	$('#projectContainer').addClass('loaded');


	_$projectIsOpened = true;

	for (var i = 0; i < _$sortedProjects.length; i++) {

		var rand = Math.random() * .5;
		var AnimationVariable = 'all .5s ease-out';

		$('#project' + _$sortedProjects[i].id)
		//.delay(Math.round(Math.random() * 800 + 200) * d)
		//.removeClass('closed').addClass('opened')
		.css({
			'width': _$projectWidth * (1.0 - _$imageGapPercentage * 2),
			'height': _$projectHeight * (1.0 - _$imageGapPercentage * 2),
			'top': projectPos[i].top + containerBasePos + _$projectHeight * _$imageGapPercentage,
			'left': projectPos[i].left + _$projectWidth * _$imageGapPercentage,
			'opacity' : 1,
			'-webkit-transform': 	'scale(1,1)',
			'-moz-transform': 		'scale(1,1)',
			'-ms-transform': 		'scale(1,1)',
			'-o-transform': 		'scale(1,1)',
			'transform': 			'scale(1,1)',
			'-webkit-transition': AnimationVariable,
			'-moz-transition': 	  AnimationVariable,
			'-ms-transition': 	  AnimationVariable,
			'-o-transition': 	  AnimationVariable,
			'transition': 		  AnimationVariable,
			'-webkit-transition-delay': rand + 'S',
			'transition-delay':   rand + 'S'

		});

		/*.stop().animate({
			'top': projectPos[i].top + containerBasePos,
			'left': projectPos[i].left
		}, 600, function() {
			projectscrollable = true;
		});*/

	}

}

function animateProject(d, speed) {

	
	var AnimationVariable = 'all .5s ease-out';

	for (var i = 0; i < _$sortedProjects.length; i++) {

		var rand = Math.random() * .3;

		$('#project' + _$sortedProjects[i].id)
		.css({
			'width': _$projectWidth * (1.0 - _$imageGapPercentage * 2),
			'height': _$projectHeight * (1.0 - _$imageGapPercentage * 2),
			'top': projectPos[i].top + containerBasePos + _$projectHeight * _$imageGapPercentage,
			'left': projectPos[i].left + _$projectWidth * _$imageGapPercentage,
			'-webkit-transition': AnimationVariable,
			'-moz-transition': 	  AnimationVariable,
			'-ms-transition': 	  AnimationVariable,
			'-o-transition': 	  AnimationVariable,
			'transition': 		  AnimationVariable,
			'-webkit-transition': rand + 'S',
			'transition-delay':   rand + 'S'

		});

	}

	$('footer').stop().animate({ 'top': (projectContainerHeight) }, speed * 5);

}


function adjustSize_perPage(){

	var xcounter = 1;

	// Determine the width of the project depending on the window width
	_$projectWidth = $(window).width();
	while (_$projectWidth > _$maximumThumbSize) {
		_$projectWidth = Math.floor($(window).width() / xcounter);
		xcounter++;
	}

	// Adjust the project height from the project width
	if(_$isMobile)
		_$projectHeight = _$projectWidth * 1.5;
	else
		_$projectHeight = _$projectWidth * 1.5;

	// Adjust the project CSS values (Image is always square)
	$('.img-container').css({'width':_$projectWidth, 'height':_$projectWidth});


	xcounter = Math.floor($(window).width() / _$projectWidth);

	// Adjust the H1 sizes accordingly!
	if(!_$isMobile)
		$('.img-over-caption h1').css({ 'font-size': Math.round(_$projectWidth / 0.9) / 10 });
	else
		$('.img-over-caption h1').css({ 'font-size': Math.round(_$projectWidth / 2.4) / 10 });

	projectPos = [];

	var j = 0,
		k = 0;
	for (var i = 0; i < _$sortedProjects.length; i++) {

		projectPos[i] = {
			top: _$projectHeight * k,
			left: _$projectWidth * j
		}
		if (j < xcounter - 1)
			j++;
		else {
			j = 0;
			k++;
		}
	}

	projectContainerHeight = Math.ceil(_$sortedProjects.length / xcounter) * _$projectHeight;

	if(_$projectIsOpened)
		animateProject(0, 100);
	


	// Hero Image
	_HERO_AdjustProject();
	
}



// Animate Preloading Image Page
function _HERO_AdjustProject(){


	// Adjust slider size and position
	$('.preloadingContentSlider').css({
		'top':_$windowHeight/_$heroCount * _$heroCounter,
		'height':_$windowHeight/_$heroCount
	});

	// Adjust page locations
	$('.heroProject').css({'height':_$windowHeight});
	$('#heroProject1').css({'top':_$windowHeight * (-1 * _$heroCounter)});
	$('#heroProject2').css({'top':_$windowHeight * (-1 * _$heroCounter + 1)});
	$('#heroProject3').css({'top':_$windowHeight * (-1 * _$heroCounter + 2)});
	$('#heroProject4').css({'top':_$windowHeight * (-1 * _$heroCounter + 3)});
	$('#heroProject5').css({'top':_$windowHeight * (-1 * _$heroCounter + 4)});


	// Depending on current page status, change status for each element
	_HERO_AdjustFocus();


	// When outside of hero image
	if(_$heroCounter > _$heroCount-1){
		$('.goToAllProject').css({'display':'none'});
		// Set scroll position of grid container to top
		$('#projectContainer').scrollTop = 0;
	}else{
		$('.goToAllProject').css({'display':'block'});
	}

	
}


/*
	HERO : Depending on current page status, change status for each element
*/

function _HERO_AdjustFocus(){


	// Toggle Black and White Texts
	if(_$heroCounter == 1 || _$heroCounter == 3){
		$('.goToAllProject').css({
			'border-color':'#000',
			'color': '#000'
		});
	}else{
		$('.goToAllProject').css({
			'border-color':'#FFF',
			'color': '#FFF'
		});
	}

	// Parallax Effect
	if(_$heroCounter == 0){
		$('.heroProject').removeClass('focused');
		$('#heroProject1').addClass('focused');
	}else if(_$heroCounter == 1){
		$('.heroProject').removeClass('focused');
		$('#heroProject2').addClass('focused');
	}else if(_$heroCounter == 2){
		$('.heroProject').removeClass('focused');
		$('#heroProject3').addClass('focused');
	}else if(_$heroCounter == 3){
		$('.heroProject').removeClass('focused');
		$('#heroProject4').addClass('focused');
	}else if(_$heroCounter == 4){
		$('.heroProject').removeClass('focused');
		$('#heroProject5').addClass('focused');
	}else{
		$('.heroProject').removeClass('focused');
	}
}
/*
	Fades out projects before loading a project page
*/

function _OpenProjectPage(urlExtention){
	
	/*
		Fading out animation
	*/
	
	if(!_$isMobile){
		var AnimationVariable = 'all .4s ease-out';

		for (var i = 0; i < _$sortedProjects.length; i++) {

			var rand = Math.random() * .3;

			$('#project' + _$sortedProjects[i].id)
			.css({
				'width': 0,
				'height': 0,
				'top': projectPos[i].top + _$projectWidth/2,
				'left': projectPos[i].left + _$projectHeight/2,
				'-webkit-transition': AnimationVariable,
				'-moz-transition': 	  AnimationVariable,
				'-ms-transition': 	  AnimationVariable,
				'-o-transition': 	  AnimationVariable,
				'transition': 		  AnimationVariable,
				'-webkit-transition': rand + 'S',
				'transition-delay':   rand + 'S'

			});

		}

		setTimeout(loadNewPage, 800);
	}else{
		loadNewPage();
	}

	function loadNewPage(){
		if ($_GET('type') !== false)
			window.location.href = 'project.html?type=' + $_GET('type') + '#' + urlExtention;
		else
			window.location.href = 'project.html#' + urlExtention;
	}

}




/*
	Hero Interaction
*/




/*
	Hover Interactions Over Projects
*/
var TO_hoverAnimation;
function HoverInFromLeft(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('prepareOpenFromLeft');
	clearTimeout(TO_hoverAnimation);
	TO_hoverAnimation = setTimeout(function() { trg.find('.img-over').addClass('openedFromLeft'); }, 1);
}

function HoverInFromRight(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('prepareOpenFromRight');
	clearTimeout(TO_hoverAnimation);
	TO_hoverAnimation = setTimeout(function() { trg.find('.img-over').addClass('openedFromRight'); }, 1);
}

function HoverInFromTop(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('prepareOpenFromTop');
	clearTimeout(TO_hoverAnimation);
	TO_hoverAnimation = setTimeout(function() { trg.find('.img-over').addClass('openedFromTop'); }, 1);
}

function HoverInFromBottom(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('prepareOpenFromBottom');
	clearTimeout(TO_hoverAnimation);
	TO_hoverAnimation = setTimeout(function() { trg.find('.img-over').addClass('openedFromBottom'); }, 1);
}


function HoverOutFromLeft(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('opened closedToLeft');
}

function HoverOutFromRight(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('opened closedToRight');
}

function HoverOutFromTop(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('opened closedToTop');
}

function HoverOutFromBottom(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('opened closedToBottom');
}



function RemoveAllClassForHover(trg) {
	trg.find('.img-over').removeClass('closed opened prepareOpenFromLeft openedFromLeft prepareOpenFromRight openedFromRight prepareOpenFromTop openedFromTop prepareOpenFromBottom openedFromBottom closedToLeft closedToRight closedToTop closedToBottom');
}
