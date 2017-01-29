/*
	Angular
*/
// Make sure the GET only happens once
var _$LoadOnceSafety = false;

var myApp = angular.module("myApp", ['ngAnimate', 'ngSanitize'])
.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
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

		if(!_$LoadOnceSafety){
			_$LoadOnceSafety = true;
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
				_$singleProjectData = _GetProjectFromNameID (window.location.hash.substr(2));

				// -- Project Injections
				$scope.myProject = _$singleProjectData;

				// -- Filters
				var MyCategories = [], MyRoles = [], MySoftwares = [];
				
				var j=0;
				while(j<_$singleProjectData.cat.length){
					var a = j;
					j = CheckFilter(_$catArray, MyCategories, j);
					j = CheckFilter(_$roleArray, MyRoles, j);
					j = CheckFilter(_$softArray, MySoftwares, j);
					if(a==j)j++; // SAFETY -- this is to check if none of categories match, ignore the category
				}

				function CheckFilter(Arr, TrgArr, j){
					var k=0;
					while(k<Arr.length){
						if(Arr[k].nameid == _convertStringToID(_$singleProjectData.cat[j]) ){
							TrgArr.push(Arr[k]);
							j++;
							return j;
						}else{
							k++;
						}
					}
					return j;
				}

				// - Injecting Filters
				$scope.myCategories = MyCategories;
				$scope.myRoles = MyRoles;
				$scope.mySoftwares = MySoftwares;


				// -- Visual Contents
				if(_$singleProjectData.visuals.resources.length == 0)
					$('.projectVideo').remove();
				

				// -- Special Contents
				if(_$singleProjectData.special !== "")
					$('.projectSpecialContent').append(_$singleProjectData.special);
				else
					$('.projectSpecialContent').remove();

			}

			/*
				-- Populate Page Title
			*/
			if(_$currentPageType == "top"){
				$scope.myPageTitle = "OPTMYST";
			}else{
				$scope.myPageTitle = _$singleProjectData.title;
			}

			/*
				-- Populate Filter
			*/
			$scope.myFiltersCat = _$catArray;
			$scope.myFiltersRole = _$roleArray;
			


			// -- Populate Footer (Youtube Video)
			if(_$currentPageType == "top" && isYoutube(_$youtubeUrl) != false)
				$scope.youtubeUrl = {src: "http://www.youtube.com/embed/" + isYoutube(_$youtubeUrl) + "?autoplay=0&controls=1&showinfo=0"};
			else
				$('#videocontainer').remove();


			// -- Start Loading
			if (window.location.hash.replace("#", "") !== "" || isFirstTime === false) {
				
				// -- Wait for Angular Injections
				// -- Not needing to wait for loading images
				setTimeout(_CheckMySortFromURL, 2000);

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
			setTimeout(_JustLoaded, 200);

			// -- Run This For Individual Page
			_PerPageJustLoaded();

			// -- Begin Scroll Function
			$(window).scroll(function() { _ScrollFunction(); });

			// -- Begin Resize Function
			$(window).resize(function() {
				if (_$resizetimeout != null)
					clearTimeout(_$resizetimeout);

				_$resizetimeout = setTimeout(function() {
					_WindowResized();
				}, 300);
			});
		}

	});


	/*
		Loading the Project Page
	*/ 
	$scope.loadProjectPage = function($projectTitle) {

		if(_$currentPageType == "top"){
			// If otherwise, just load new project page with hashtag
			_linkFromFooter(_convertStringToID($projectTitle), false, false);

		}else{
			
			// If you are currently in the project page, just update the hash tag and reload
			window.location.hash = _convertStringToID($projectTitle);
			window.location.reload();
			
			
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

		_linkFromFooter(false, true, (_$currentPageType == "top"));

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

			_linkFromFooter($Filter.nameid, true, (_$currentPageType == "top"));
		
		}

		
		
	}

	
}]);


/*
	Angular
*/




/////////////////
/////////////////

/* Window Sizes*/
var _$windowWidth, _$windowHeight, 
_$windowTopPos, _$windowTopPosOld = -1, _$windowBottomPos;


var isFirstTime = false;
/* Device Detections */
var _$isMobile = false;

// --- Check Device
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
	_$isMobile = true;




/*
	Runs after the data is loaded and after angular is ran
*/
function _JustLoaded(){

	// -- Run once to get all size values
	_WindowResized();

	// -- Run in case if project image is within view port.
	setTimeout(_ScrollFunction, 1200);

	$('footer').css({'visibility':'visible'}).removeClass('closed').addClass('opened');

	/*
		-- Add Click Events
	*/
	$('#linktoback').click(function(){
		window.history.back();
	});

	$(window).scrollTop();

}



/*
	Scroll Animation
*/
function _ScrollFunction(){

	// -- Updating Windows' Positions
	_$windowTopPos = $(window).scrollTop();
	_$windowBottomPos = (_$windowTopPos + _$windowHeight);


	if(_$currentPageType == "project"){
		
		// if(!_$isMobile){
		// 	if (_$windowTopPos >_$windowTopPosOld){
		// 		// downscroll code
		// 		$('header nav').removeClass('headerOpened').addClass('headerClosed');
		// 		$('.singleProjectBody').removeClass('headerOpened').addClass('headerClosed');
		// 	} else {
		// 		  // upscroll code
		// 		$('header nav').removeClass('headerClosed').addClass('headerOpened');
		// 		$('.singleProjectBody').removeClass('headerClosed').addClass('headerOpened');
		// 	}
		// }


		if(_$singleProjectData.visuals.resources.length > 0)
			$.each($('.projectVisuals'), function() {
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
		if ((ElementBottomPos >= _$windowTopPos - 200) &&
			(ElementTopPos <= _$windowBottomPos + 50)){
			Element.addClass('inViewPort inViewPortAlready');
		}else{
			Element.removeClass('inViewPort');
		}
	}


	// -- Updating Old Scroll
	_$windowTopPosOld = _$windowTopPos;

}


/*
	Window Resize
*/
var _$resizetimeout = false;
function _WindowResized(){

	// -- Update Window Sizes
	_$windowHeight = $(window).height();
	_$windowWidth = $(window).width();
	
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
			project.cat = _ConvertStringToArray($data.feed.entry[8 + i].gsx$content.$t, false);
				
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
				-- Visual Contents --
			*/
			if($data.feed.entry[10 + i].gsx$content.$t != "")
				project.visuals = JSON.parse($data.feed.entry[10 + i].gsx$content.$t);
			else
				project.visuals = {resources:[]};

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

