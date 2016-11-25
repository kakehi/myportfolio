$(document).ready(function(){

	var scrollon = false;

 	
	var initialPos =0;
	var animateSetTimeOut;
	var projNumb = 0, pastprojNumb = 0;

	var goalPosY1 = 0, goalPosY2 = 0, goalPosY3 = 0, goalPosY4 = 0;

	var scrollInterval = 20;

	// --  Measure if scroll is stuck at bottom
	var lasctScrollTop = 0;


	// --- Check Device
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		isMobile = true;
	}

	_loadJSON($_GET('portfolio'), 'od6');


	$('#filterButton').click(function(){
		if(filterOpen === false){
			openFilter();
		}else{
			closeFilter();
		}
	});

});

var projecton = false;
var projectscrollable = false;
var projectcandispatchUp = true;

var containerBasePos = 0;

// height and width of the project
var projectSize = 0;
var projectPos=[];

var projectContainerHeight;

var _projectDiv = [];
var _sortedProjectDiv = [];

function createProject(){


	createFooter($('body'));	

}
function closeProject(){

	for(var i=0; i<_sortedProjectDiv.length; i++){
		_sortedProjectDiv[i].delay(Math.round(Math.random()*500+500)).animate({
			transform:'scale(0,0)'
		});
	}

}
function openProject(d){

	for(var i=0; i<_sortedProjectDiv.length; i++){

		_sortedProjectDiv[i].delay(Math.round(Math.random()*500+500) * d).animate({
			'top':projectPos[i].top + containerBasePos,
			'left':projectPos[i].left,
			transform:'scale(1,1)'
		}, function(){projectscrollable = true;});
	}

}

function animateProject(d, speed){
	
	projectscrollable = false;
	for(var i=0; i<_sortedProjectDiv.length; i++){

		_sortedProjectDiv[i].stop().animate({'width':projectSize,'height':projectSize,'top':projectPos[i].top + containerBasePos,'left':projectPos[i].left}, speed*5, function(){projectscrollable = true;});
	}

	$('#projectContainer').find('#videocontainer').animate({'top':(projectContainerHeight + 600)},  speed*5);
	

}










function adjustSize(){

	

	var xcounter=1;
	projectSize =  $(window).width();
	while (projectSize > 600){
		projectSize =  Math.floor($(window).width()/xcounter);
		xcounter++;
	}
	

	projectPos = [];

	var j=0, k=0;
	for(var i=0; i<_sortedProjectDiv.length; i++){

		
		projectPos[i] = {
			top : projectSize * k,
			left : projectSize * j
		}
		if(j<xcounter-2){
			j++;
		}else{
			j=0;
			k++;
		}
	}

	projectContainerHeight = k * projectSize;

}


var resizetimeout = false;
$(window).resize(function(){

	if(resizetimeout != null){
		clearTimeout(resizetimeout);
	}
	resizetimeout = setTimeout(function(){
		adjustSize();
		animateProject(0, 100);
	},300);
	

});