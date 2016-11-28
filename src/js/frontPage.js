
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


	if (isMobile === true) {
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

	_loadJSON($_GET('portfolio'), 'od6');

	$('.svg-wrapper').click(function(event) {
		if (filterOpen === false) {
			openFilter();
		} else {
			closeFilter();
		}
		$(this).toggleClass('open');
	});
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

var _projectDiv = [];
var _sortedProjectDiv = [];

function createProject() {

	for (var i = 0; i < _myProjects.length; i++) {
		$('#projectContainer').append('<div class="project" id="project' + i + '" data-id="' + i + '" style="z-index:' + (10000 + i) + '"><img class="img-container closed"src="img/' + _myProjects[i].thumb + '"><div class="img-over closed"></div><div class="img-over-caption closed"><h1>' + _myProjects[i].title + '</h1><h3><span>' + _myProjects[i].subtitle + '</span></h3></div></div>');
		_projectDiv.push($('#projectContainer').find('#project' + i));
	}

	_sortedProjectDiv = _projectDiv;

	adjustSize();

	for (var i = 0; i < _myProjects.length; i++) {

		$('#projectContainer').find('#project' + i).css({
			'width': projectSize,
			'height': projectSize,
			'top': projectPos[i].top,
			'left': projectPos[i].left,
			transform: 'scale(0,0)'
		});

		// hover action
		if (isMobile === false) {
			$('#projectContainer').find('#project' + i).mouseenter(function(event) {
				$(this).find('.img-container').removeClass('closed').addClass('opened');
				$(this).find('.img-over-caption').removeClass('closed').addClass('opened');

				// -- Check Where mouse entered from
				var tempX = event.pageX - $(this).offset().left;
				var tempY = event.pageY - $(this).offset().top;
				var halfSize = $(this).width() / 2;
				if (halfSize > tempX) {
					if (halfSize > tempY) {
						if (tempX > tempY)
							HoverInFromTop($(this));
						else
							HoverInFromLeft($(this));
					} else {
						if (tempX > $(this).width() - tempY)
							HoverInFromBottom($(this));
						else
							HoverInFromLeft($(this));
					}
				} else {
					if (halfSize > tempY) {
						if ($(this).width() - tempX > tempY)
							HoverInFromTop($(this));
						else
							HoverInFromRight($(this));
					} else {
						if ($(this).width() - tempX > $(this).width() - tempY)
							HoverInFromBottom($(this));
						else
							HoverInFromRight($(this));
					}

				}
				// -- Check Where mouse entered from

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
		}
		$('#projectContainer').find('#project' + i).click(function(event) {

			//console.log($_GET('type'));

			if ($_GET('type') !== false) {
				window.location.href = 'project.html?type=' + $_GET('type') + '#' + _myProjects[$(this).data('id')].id;
			} else {
				window.location.href = 'project.html#' + _myProjects[$(this).data('id')].id;
			}

		});


	}

	createFooter($('#projectContainer'));

	$('footer').attr({ 'id': 'videocontainer' });
	$('footer').css({ 'top': (projectContainerHeight + 600) });

	if (isYoutube(_youtubeurl) != false) {
		$('footer').prepend('<iframe src="http://www.youtube.com/embed/' + isYoutube(_youtubeurl) + '?autoplay=0&controls=1&showinfo=0"></iframe>');
	}


}

function closeProject() {

	for (var i = 0; i < _sortedProjectDiv.length; i++) {
		_sortedProjectDiv[i].delay(Math.round(Math.random() * 500 + 500)).animate({
			transform: 'scale(0,0)'
		});
	}

}

function openProject(d) {

	for (var i = 0; i < _sortedProjectDiv.length; i++) {

		_sortedProjectDiv[i].delay(Math.round(Math.random() * 500 + 500) * d).animate({
			'top': projectPos[i].top + containerBasePos,
			'left': projectPos[i].left,
			transform: 'scale(1,1)'
		}, function() { projectscrollable = true; });
	}

}

function animateProject(d, speed) {

	projectscrollable = false;
	for (var i = 0; i < _sortedProjectDiv.length; i++) {

		_sortedProjectDiv[i].stop().animate({ 'width': projectSize, 'height': projectSize, 'top': projectPos[i].top + containerBasePos, 'left': projectPos[i].left, transform:'scale(1, 1)'}, speed * 5, function() { projectscrollable = true; });
	}

	$('#projectContainer').find('#videocontainer').stop().animate({ 'top': (projectContainerHeight) }, speed * 5);


}

var kk;





function adjustSize() {



	var xcounter = 1;
	projectSize = $(window).width();
	while (projectSize > 600) {
		projectSize = Math.floor($(window).width() / xcounter);
		xcounter++;
	}

	xcounter = Math.floor($(window).width() / projectSize);

	$('.img-over-caption h1').css({ 'font-size': Math.round(projectSize / 0.9) / 10 });


	projectPos = [];

	var j = 0,
		k = 0;
	for (var i = 0; i < _sortedProjectDiv.length; i++) {


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

	projectContainerHeight = Math.ceil(_sortedProjectDiv.length / xcounter) * projectSize;

}


var resizetimeout = false;
$(window).resize(function() {

	if (resizetimeout != null)
		clearTimeout(resizetimeout);

	resizetimeout = setTimeout(function() {
		adjustSize();
		animateProject(0, 100);
	}, 300);


});




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
