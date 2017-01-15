
var _$projectIsOpened = false;
// -- Check filter status
var _$filterIsOpened = false;

// -- Image Sizes
var _$maximumThumbSize = 600;

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

//////////////////////////



var scrollon = false;

var initialPos = 0;
var animateSetTimeOut;
var projNumb = 0,
	pastprojNumb = 0;

var goalPosY1 = 0,
	goalPosY2 = 0,
	goalPosY3 = 0,
	goalPosY4 = 0;

var scrollInterval = 5;

// --  Measure if scroll is stuck at bottom

var lasctScrollTop = 0;

$(document).ready(function() {

	// check cookie
	var visited = $.cookie("visited")
	if ($.cookie("visited") != 'yes') {
		$.cookie('visited', 'yes');
		isFirstTime = true;
	}

	// set cookie
	$.cookie('visited', 'yes', { expires: 1, path: '/' });


	if (_$isMobile) {
		var lastScrollTop = 0;
		window.addEventListener('scroll', function() {
			var st = $(this).scrollTop();
			if (st > lastScrollTop) {

				scrollon = true;
				movePage(false);

			}

			lastScrollTop = st;

		});

	}

	
});

function movePage(event) {

	if (initialPos < -2 && projNumb < 4 && scrollon === false) {
		projNumb += 1;
		scrollon = true;
	}

	if (initialPos > 2 && projNumb > 0 && scrollon === false && projectcandispatchUp === true) {
		projNumb -= 1;
		scrollon = true;
	}

	if (projNumb === 0) {
		goalPosY1 = goalPosY2 = goalPosY3 = goalPosY4 = 0;
	}


	if (projNumb === 1) {

		goalPosY1 = goalPosY2 = goalPosY3 = goalPosY4 = -1.5 * $(window).height();

		if (projecton === false) {
			openProject(1);
			projecton = true;
			scrollInterval = 100;
		}
	}


	if ($('#projectContainer').scrollTop() === 0) {
		containerBasePos = 0;
		setTimeout(function() {
			projectcandispatchUp = true;

		}, 600);
		//animateProject(0, 100);
	}


	if ($('#projectContainer').scrollTop() > 0) {

		projectcandispatchUp = false;
	}

	if (initialPos != 0 && scrollon === true) {
		var speed = Math.round(Math.abs(1000 - Math.abs((initialPos + 100) * 2)) / 1.2);
		if (speed > 1000) { speed = 1000; }
		if (speed < 600) { speed = 600; }
		var delay = 0;
		$('#introPage1').stop().animate({ 'top': goalPosY1 }, speed);
		$('#introPage2').stop().animate({ 'top': goalPosY2 }, speed);
		$('#introPage3').stop().animate({ 'top': goalPosY3 }, speed);
		$('#introPage4').stop().animate({ 'top': goalPosY4 }, speed, function() {
			var t = 0;
			if (projNumb === 4 && $('#projectContainer').scrollTop() < 150) {
				t = 3500;
			} else {
				t = 600;
			}
			setTimeout(function() {
				scrollon = false;
			}, t);

		});
		initialPos = 0;
	}

	lasctScrollTop = $('#projectContainer').scrollTop();


}

var projecton = false;
var projectscrollable = false;
var projectcandispatchUp = true;

var containerBasePos = 0;

// height and width of the project
var projectSize = 0;
var projectPos = [];

var projectContainerHeight;


function _CreateAnimationAndEventsToProjects() {


	adjustSize_perPage();

	for (var i = 0; i < _$projects.length; i++) {
		
		/*
			Applying the initial positioning when 
		*/
		$('#project' + _$projects[i].id).css({
			'width': projectSize,
			'height': projectSize,
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
				$(this).find('.img-container').removeClass('opened').addClass('closed');
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

				Elm.find('.img-container').removeClass('closed').addClass('opened');
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

}

function closeProject() {

	for (var i = 0; i < _$sortedProjects.length; i++) {

		$('#project' + _$sortedProjects[i].id).delay(Math.round(Math.random() * 500 + 500)).animate({
			transform: 'scale(0,0)'
		});
	}

}

function openProject(d) {

	_$projectIsOpened = true;

	for (var i = 0; i < _$sortedProjects.length; i++) {

		var rand = Math.random() * .5;
		var AnimationVariable = 'all .5s ease-out';

		$('#project' + _$sortedProjects[i].id)
		//.delay(Math.round(Math.random() * 800 + 200) * d)
		//.removeClass('closed').addClass('opened')
		.css({
			'width': projectSize,
			'height': projectSize,
			'top': projectPos[i].top + containerBasePos,
			'left': projectPos[i].left,
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

		var rand = Math.random() * .5;

		$('#project' + _$sortedProjects[i].id)
		.css({
			'width': projectSize,
			'height': projectSize,
			'top': projectPos[i].top + containerBasePos,
			'left': projectPos[i].left,
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
	projectSize = $(window).width();
	while (projectSize > _$maximumThumbSize) {
		projectSize = Math.floor($(window).width() / xcounter);
		xcounter++;
	}

	xcounter = Math.floor($(window).width() / projectSize);

	$('.img-over-caption h1').css({ 'font-size': Math.round(projectSize / 0.9) / 10 });


	projectPos = [];

	var j = 0,
		k = 0;
	for (var i = 0; i < _$sortedProjects.length; i++) {

		projectPos[i] = {
			top: projectSize * k,
			left: projectSize * j
		}
		if (j < xcounter - 1)
			j++;
		else {
			j = 0;
			k++;
		}
	}

	projectContainerHeight = Math.ceil(_$sortedProjects.length / xcounter) * projectSize;

	if(_$projectIsOpened)
		animateProject(0, 100);
}



/*
	Fades out projects before loading a project page
*/

function _OpenProjectPage(urlExtention){
	
	/*
		Fading out animation
	*/
	var AnimationVariable = 'all .5s ease-out';

	for (var i = 0; i < _$sortedProjects.length; i++) {

		var rand = Math.random() * .3;

		$('#project' + _$sortedProjects[i].id)
		.css({
			'width': 0,
			'height': 0,
			'top': projectPos[i].top + projectSize/2,
			'left': projectPos[i].left + projectSize/2,
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

	function loadNewPage(){
		if ($_GET('type') !== false)
			window.location.href = 'project.html?type=' + $_GET('type') + '#' + urlExtention;
		else
			window.location.href = 'project.html#' + urlExtention;
	}

}


/*
	Hover Interactions Over Projects
*/
function HoverInFromLeft(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('prepareOpenFromLeft');
	setTimeout(function() { trg.find('.img-over').addClass('openedFromLeft'); }, 1);
}

function HoverInFromRight(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('prepareOpenFromRight');
	setTimeout(function() { trg.find('.img-over').addClass('openedFromRight'); }, 1);
}

function HoverInFromTop(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('prepareOpenFromTop');
	setTimeout(function() { trg.find('.img-over').addClass('openedFromTop'); }, 1);
}

function HoverInFromBottom(trg) {
	RemoveAllClassForHover(trg);
	trg.find('.img-over').addClass('prepareOpenFromBottom');
	setTimeout(function() { trg.find('.img-over').addClass('openedFromBottom'); }, 1);
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
