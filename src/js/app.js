/*
	Angular
*/

var myApp = angular.module("myApp", ['ngAnimate'])
.controller("myProjects", ['$scope', '$http', '$sce', function($scope, $http, $sce) {
	
	// External Link
	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	}


	$http({
		method: 'GET',
		url: 'https://spreadsheets.google.com/feeds/list/1LjdZTcQD3IiaL55n-W1PN2naSrYEN0THl5KKe7HlTiI/od6/public/values?alt=json'
	})
	.success(function($data){

		// -- Pass Filter Elements From Data To Create Local Filter DB
		_CreateFilterDB($data.feed.entry[1], $data.feed.entry[2], $data.feed.entry[3]);

		// -- To Create Local Project DB
		_CreateDataFromSpreadSheet($data);

		/*
			-- Populate Projects
		*/
		// -- All Projects Injection
		$scope.myProjects = _$sortedProjects;
		if(_$currentPageType == "top"){
			
			// -- TOP PAGE

			// -- Wait for Angular Injections
			setTimeout(_CreateAnimationAndEventsToProjects, 200);
		
		}else{

			// -- PROJECT PAGE
			
			_$singleProjectData = _GetProjectFromNameID (window.location.hash.substr(1));

			// -- Project Injections
			$scope.myProject = _$singleProjectData;


			// -- Special Contents
			if(_$singleProjectData.special !== "")
				$('._specialContent').append(_$singleProjectData.special);

		}

		// -- Populate Filter
		$scope.myFiltersCat = _$catArray;
		$scope.myFiltersRole = _$roleArray;
		
		// -- Populate YouTube Video
		if(isYoutube(_$youtubeUrl) != false)
			$scope.youtubeUrl = {src: "http://www.youtube.com/embed/" + isYoutube(_$youtubeUrl) + "?autoplay=0&controls=1&showinfo=0"};


		// -- Start Loading
		if (window.location.hash.replace("#", "") !== "" || isFirstTime === false) {
			
			// -- Wait for Angular Injections
			setTimeout(_CheckMySortFromURL, 200);

		} else {

			var counter = 0;
			var startAnimation = setInterval(function() {
			   
				_movePageImmediately(1);
				
				if (counter < 1)
					counter++;
				else
					clearInterval(startAnimation);
			
			}, 2000);

		}


		/*
			Angular Ending
		*/

		// -- Run This
		_JustLoaded();

		// -- Run This For Individual Page
		_PerPageJustLoaded();

		// -- Begin Scroll Function
		$(window).scroll(function() { _ScrollFunction(); });

		// -- Begin Resize Function
		$(window).resize(function() {
			if (_$resizetimeout != null)
				clearTimeout(_$resizetimeout);

			_$resizetimeout = setTimeout(function() {
				WindowResized();
			}, 300);
		});

	});


	/*
		Loading the Project Page
	*/ 
	$scope.loadProjectPage = function($projectTitle) {

		
		if(_$currentPageType == "Top"){
			// If you are currently in the front page, just update the hash tag and reload
			window.location.hash = _convertStringToID($projectTitle);
			window.location.reload();

		}else{
			// If otherwise, just load new project page with hashtag
			_linkFromFooter(_convertStringToID($projectTitle), false, false);
			
		}

	};

	/*
		Loading the Category Page
	*/
	$scope.loadCategoryPage = function($category) {

		/* TODO think about how to open categorie. */
		_linkFromFooter(_convertStringToID($category), false, true);
		
	}

	/*
		Link to Home
	*/
	$scope.linkToHome = function(){

		_linkFromFooter(false, true, true);

	}



	// ------- FILTER

	/*
		Sort Project by Filter
	*/
	$scope.sortProject = function($event, $Filter){

		if(_$currentPageType == "top"){
			
			/* --Top Page -- */

			_SortProjectByFilter($Filter);

			if(_HasClass($event.currentTarget, 'footerProjectFilterList'))
				window.location.reload();
		
		}else if(_$currentPageType == "project"){

			/* -- Project Page -- */

			_linkFromFooter($Filter.nameid, true, false);
		
		}

		
		
	}

	
}]);


/*
	Angular
*/




/////////////////
/////////////////

/* Window Sizes*/
var _$windowWidth, _$windowHeight, _$windowTopPos;


/*
	Runs after the data is loaded and after angular is ran
*/
function _JustLoaded(){

	$('footer').css({'visibility':'visible'}).removeClass('closed').addClass('opened');

	/*
		-- Add Click Events
	*/
	$('#linktoback').click(function(){
		window.history.back();
	});

	$('.linktoproject').click(function(){
		_linkFromFooter(false, false, true);
	});
}


/*
	Scroll Animation
*/
function _ScrollFunction(){
	
	var WindowHeight = $(window).height();
	var WindowTopPos = $(window).scrollTop();
	var WindowBottomPos = (WindowTopPos + WindowHeight);


	if(_$currentPageType == "project"){
		
		// Check if Project Images are in View Port
		
		$.each($('.projectImage'), function() {
			_CheckIfElementIsInView($(this), true)
		});
	}

	/*
		Check if "Element" is in the view port.
	*/
	function _CheckIfElementIsInView(Element){

		var ElementHeight = Element.outerHeight();
		var ElementTopPos = Element.offset().top;
		var ElementBottomPos = (ElementTopPos + ElementHeight);

		// Check if this is in the viewport
		if ((ElementBottomPos >= WindowTopPos + 200) &&
			(ElementTopPos <= WindowBottomPos - 200)){
			Element.addClass('inViewPort inViewPortAlready');
		}else{
			Element.removeClass('inViewPort');
		}
	}
}


/*
	Window Resize
*/
var _$resizetimeout = false;
function WindowResized(){

	
	// -- Individual Pages
	adjustSize_perPage();
}



////////////////////////////////////////////////////////////


	



////// -----


function _linkFromFooter(hash, top, home){

	var dest = "", hashparam = "", param = getParam('type');

	if( _$currentPageType == "project" && !home ){
		dest = "index.html";
	}

	if( _$currentPageType == "top" && !home){
		dest = "project.html";
	}


	if(top === true){
		$.cookie('visited', null);
	}

	if(hash){
		hashparam = '#' + hash;
	}

	if(param){
		dest = dest + ("?type=") + getParam('type') + hashparam;
	}else{
		dest = dest + hashparam;
	}

	window.location.href = dest;
}

////////////////////////////////////////////////////////////















// -- Projects
var _$projects = [], _$sortedProjects = [];

// -- Youtube Link
var _$youtubeUrl;

// -- List of Client
var _$clientlist;

function _CreateDataFromSpreadSheet($data){

	// Extract YRL Parameter
	var PageType = $_GET('type');

	// Extracting Youtube URL
	_$youtubeUrl = $data.feed.entry[4].gsx$content.$t;


	var _projectCount = parseInt($data.feed.entry[5].gsx$content.$t);
	var _projectCounter = 0;
	
	for (var i = 6; i < 6 + 12 * _projectCount; i += 12) {

		// -- Extract only if which projects are ok and not.
		var _pageTypeQuery = "y";

		if (PageType === 'mkkpn' || PageType === false)
		   _pageTypeQuery = $data.feed.entry[i].gsx$mkkpn.$t;
		else if (PageType === 'ylagyf') 
			_pageTypeQuery = $data.feed.entry[i].gsx$ylagyf.$t;
		else if (PageType === 'epanz')
			_pageTypeQuery = $data.feed.entry[i].gsx$epanz.$t;
		else if (PageType === 'gacdpe')
			_pageTypeQuery = $data.feed.entry[i].gsx$gacdpe.$t;

		// -- Include if it is not excluded
		if (_pageTypeQuery !== "") {

			var projectArray = [];
			var project = {};
			
			/* -- information --*/
			project.buttonid = '_to' + _convertStringToID(String($data.feed.entry[i].gsx$content.$t)) + 'Button'; // id
			project.id = _convertStringToID(String($data.feed.entry[i].gsx$content.$t)); // id
			project.title = String($data.feed.entry[i].gsx$content.$t); // title
			project.subtitle = String($data.feed.entry[1 + i].gsx$content.$t); // subtitle
			project.client = String($data.feed.entry[2 + i].gsx$content.$t); // client
			project.year = String($data.feed.entry[3 + i].gsx$content.$t); // Year
			project.status = String($data.feed.entry[4 + i].gsx$content.$t); // Status
			project.header = String($data.feed.entry[6 + i].gsx$content.$t); // HeeaderImage
			project.desc = String($data.feed.entry[7 + i].gsx$content.$t); // Description
			/* -- information --*/

			/* 
				-- Category --
			*/
			project.cat = _convertStringToArray($data.feed.entry[8 + i].gsx$content.$t, false);
				
			// check which categories there are per project and accumulates all types
			for(var j=0; j<project.cat.length; j++){
				if(_$activeFilterObjects.length > 0){
					// -- If it is already stored category, skip to next.
					var k=0;
					var tempPlace = true;
					while(k < _$activeFilterObjects.length){
						if(_$activeFilterObjects[k].nameid == _convertStringToID(project.cat[j])){
							tempPlace = false;
							k = _$activeFilterObjects.length;
						}else{
							k++;
						}
					}
					if(tempPlace)
						_$activeFilterObjects.push(_ReturnFilterObject(_convertStringToID(project.cat[j])));
				}else{
					_$activeFilterObjects.push(_ReturnFilterObject(_convertStringToID(project.cat[j])));
				}
			}
			/* 
				-- Category --
			*/

			/* 
				-- Thumbnail --
			*/
			project.thumb = $data.feed.entry[9 + i].gsx$content.$t;

			/* 
				-- Image --
			*/
			project.img = _convertStringToArray($data.feed.entry[10 + i].gsx$content.$t, true);

			/* 
				-- Special Contents --
			*/
			project.special = $data.feed.entry[11 + i].gsx$content.$t;

			_$projects.push(project);

		}

		_projectCounter++;

	}

	/* -- Eliminate Categories that Do Not Exist --*/

	var tempArr = [];
	for(i = 0; i<_$activeFilterObjects.length; i++){
		var j=0;
		var doesNotExist = true;
		while(j< _$catArray.length){
			if( _$activeFilterObjects[i] == _$catArray[j]){
				doesNotExist = false;
				j = _$catArray.length;
			}else
				j++;
		}
		if(!doesNotExist)
			tempArr.push(_$catArray.splice(_$catArray.indexOf(_$activeFilterObjects[i]), 1)[0]);
	}
	_$catArray = tempArr;

	tempArr = [];
	for(i = 0; i<_$activeFilterObjects.length; i++){
		var j=0;
		var doesNotExist = true;
		while(j< _$roleArray.length){
			if( _$activeFilterObjects[i] == _$roleArray[j]){
				doesNotExist = false;
				j = _$roleArray.length;
			}else
				j++;
		}
		if(!doesNotExist)
			tempArr.push(_$roleArray.splice(_$roleArray.indexOf(_$activeFilterObjects[i]), 1)[0]);
	}
	_$roleArray = tempArr;

	tempArr = [];
	for(i = 0; i<_$activeFilterObjects.length; i++){
		var j=0;
		var doesNotExist = true;
		while(j< _$softArray.length){
			if( _$activeFilterObjects[i] == _$softArray[j]){
				doesNotExist = false;
				j = _$softArray.length;
			}else
				j++;
		}
		if(!doesNotExist)
			tempArr.push(_$softArray.splice(_$softArray.indexOf(_$activeFilterObjects[i]), 1)[0]);
	}
	_$softArray = tempArr;


	/* -- projects --*/

	/*_myProjectSort = _$catArray.slice(0);
	for (i = 0; i < _$roleArray.length; i++) {
		_myProjectSort.push(_$roleArray[i]);
	}
	for (i = 0; i < _$softArray.length; i++) {
		_myProjectSort.push(_$softArray[i]);
	}

	_myButtonNames = _$projects.slice(0);
	_myButtonNames.push(['_toThumbButton', '_projectThumbnails'], ['_toContactButton', 'contact']);
	_numberOfPrologue = 2;

	_myImageViewersContainerArray = _myButtonNames.slice(0);
	_myImageViewersContainerArray.unshift(['_toClientList', 'clients', '', '']);
	*/

	// -- Default Sort Array to be Full Project Array;
	_$sortedProjects = _$projects;

	
}


function createProject2() {

	createFooter($('#projectContainer'));

	$('footer').attr({ 'id': 'videocontainer' });
	$('footer').css({ 'top': (projectContainerHeight + 600) });

	if (isYoutube(_youtubeurl) != false) {
		$('footer').prepend('<iframe src="http://www.youtube.com/embed/' + isYoutube(_youtubeurl) + '?autoplay=0&controls=1&showinfo=0"></iframe>');
	}


}


