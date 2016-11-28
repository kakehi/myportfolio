var imgLink = "img/";

// -------------- LOADING DATABASE -----------------------
var _isItTouchDevice;


var _pageType = $_GET('type');

/* inherit sizes and distances*/
var _hoverSideButtonWidth;
var _hoverSideButtonOpenWidth;
var _hoverSideButtonOpacity;

var targetMenuWidth;
var animatingIntervalTime;


var _clientlist;

var _youtubeurl;

/* -- buttons --*/

var _myProjectSort, _myProjectCategories, _myProjectRoles, _myProjectSofts;
var _mySelectedCat = [];


function $_GET(param) {

    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");

        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    if (!query_string[param]) {
        return false;
    } else {
        return query_string[param];
    }
}

function _loadJSON(urlkey, sheetkey) {

    // -- assign default if no value
    //console.log(urlkey);

    if (urlkey === false) {
        urlkey = '1LjdZTcQD3IiaL55n-W1PN2naSrYEN0THl5KKe7HlTiI';
    }

    var apiURL = "https://spreadsheets.google.com/feeds/list/" + urlkey + "/" + sheetkey + "/public/values";
    apiURL = apiURL + "?alt=json-in-script&callback=?";
    //console.log(apiURL);

    $.ajax({
        type: 'GET',
        url: apiURL,
        cache: false,
        dataType: 'jsonp',
        jsonp: 'myFunc',
        success: function(json, textStatus) {

            _createDatabase(json);

        },
        error: function(xhr, textStatus, errorThrown) {
            console.log(textStatus);
        }

    });
}


var _myProjects = [];
var _sotrtedProject = [];
var _myButtonNames, _myImageViewersContainerArray;
var _numberOfPrologue = 2;

/*-- sorting -- */

var _currentSort = null;
var _currentSortType = null; // 'cat' or 'proj'


var refreshIntervalId;

function _createDatabase(json) {

    /* -- populate pages --*/
    /* -- populate pages --*/
    /* -- populate pages --*/

    _clientlist = _convertStringToArray(json.feed.entry[0].gsx$content.$t, false);

    _myProjectCategories = _convertStringToArray(json.feed.entry[1].gsx$content.$t, false);
    _myProjectRoles = _convertStringToArray(json.feed.entry[2].gsx$content.$t, false);
    _myProjectSofts = _convertStringToArray(json.feed.entry[3].gsx$content.$t, false);

    _youtubeurl = json.feed.entry[4].gsx$content.$t;

    /* -- projects --*/

    var _projectCount = parseInt(json.feed.entry[5].gsx$content.$t);
    var _projectCounter = 0;
    for (var i = 6; i < 6 + 12 * _projectCount; i += 12) {

        // -- exclude if exlucde flag is on

        var _pageTypeQuery = "y";

        if (_pageType === 'mkkpn' || _pageType === false)
            _pageTypeQuery = json.feed.entry[i].gsx$mkkpn.$t;
		else if (_pageType === 'ylagyf') 
			_pageTypeQuery = json.feed.entry[i].gsx$ylagyf.$t;
		else if (_pageType === 'epanz')
			_pageTypeQuery = json.feed.entry[i].gsx$epanz.$t;
		else if (_pageType === 'gacdpe')
			_pageTypeQuery = json.feed.entry[i].gsx$gacdpe.$t;


        if (_pageTypeQuery !== "") {

            var projectArray = [];
            var project = {};
            /* -- information --*/
            project.buttonid = '_to' + _convertStringToID(String(json.feed.entry[i].gsx$content.$t)) + 'Button'; // id
            project.id = _convertStringToID(String(json.feed.entry[i].gsx$content.$t)); // id
            project.title = String(json.feed.entry[i].gsx$content.$t); // title
            project.subtitle = String(json.feed.entry[1 + i].gsx$content.$t); // subtitle
            project.client = String(json.feed.entry[2 + i].gsx$content.$t); // client
            project.year = String(json.feed.entry[3 + i].gsx$content.$t); // Year
            project.status = String(json.feed.entry[4 + i].gsx$content.$t); // Status
            project.header = String(json.feed.entry[6 + i].gsx$content.$t); // HeeaderImage
            project.desc = String(json.feed.entry[7 + i].gsx$content.$t); // Description
            /*projectArray[7] = "";
            projectArray[8] = "";
            /* -- information --*/

            /* -- category --*/
            project.cat = _convertStringToArray(json.feed.entry[8 + i].gsx$content.$t, false);
            
            // check which categories there are per project and accumulates all types
            for(var j=0; j<project.cat.length; j++){
	            if(_mySelectedCat.length > 0){
	            	var k=0;
	            	var tempPlace = true;
		            while(k < _mySelectedCat.length){
		            	if(_mySelectedCat[k] == project.cat[j]){
		            		tempPlace = false;
		            		k = _mySelectedCat.length;
		            	}else{
		            		k++;
		            	}
		            }
		            if(tempPlace)
		            	_mySelectedCat.push(project.cat[j]);
		        }else{
		        	_mySelectedCat.push(project.cat[j]);
		        }
		    }

            /* -- category --*/

            /* -- thumb --*/
            project.thumb = json.feed.entry[9 + i].gsx$content.$t;
            /* -- thumb --*/

            /* -- images --*/
            project.img = _convertStringToArray(json.feed.entry[10 + i].gsx$content.$t, true);
            /* -- images --*/

            /* -- special contents --*/
            project.special = json.feed.entry[11 + i].gsx$content.$t;
            /* -- special contents --*/

            _myProjects.push(project);

        }

        _projectCounter++;

    }


    /* -- Eliminate Categories that Do Not Exist --*/

    var tempArr = [];
    for(i = 0; i<_mySelectedCat.length; i++){
    	var j=0;
    	var doesNotExist = true;
    	while(j< _myProjectCategories.length){
    		if( _mySelectedCat[i] == _myProjectCategories[j]){
    			doesNotExist = false;
    			j = _myProjectCategories.length;
    		}else
    			j++;
    	}
    	if(!doesNotExist)
    		tempArr.push(_myProjectCategories.splice(_myProjectCategories.indexOf(_mySelectedCat[i]), 1)[0]);
    }
    _myProjectCategories = tempArr;

	tempArr = [];
    for(i = 0; i<_mySelectedCat.length; i++){
    	var j=0;
    	var doesNotExist = true;
    	while(j< _myProjectRoles.length){
    		if( _mySelectedCat[i] == _myProjectRoles[j]){
    			doesNotExist = false;
    			j = _myProjectRoles.length;
    		}else
    			j++;
    	}
    	if(!doesNotExist)
    		tempArr.push(_myProjectRoles.splice(_myProjectRoles.indexOf(_mySelectedCat[i]), 1)[0]);
    }
    _myProjectRoles = tempArr;

    tempArr = [];
    for(i = 0; i<_mySelectedCat.length; i++){
    	var j=0;
    	var doesNotExist = true;
    	while(j< _myProjectSofts.length){
    		if( _mySelectedCat[i] == _myProjectSofts[j]){
    			doesNotExist = false;
    			j = _myProjectSofts.length;
    		}else
    			j++;
    	}
    	if(!doesNotExist)
    		tempArr.push(_myProjectSofts.splice(_myProjectSofts.indexOf(_mySelectedCat[i]), 1)[0]);
    }
    _myProjectSofts = tempArr;


    /* -- projects --*/

    _myProjectSort = _myProjectCategories.slice(0);
    for (i = 0; i < _myProjectRoles.length; i++) {
        _myProjectSort.push(_myProjectRoles[i]);
    }
    for (i = 0; i < _myProjectSofts.length; i++) {
        _myProjectSort.push(_myProjectSofts[i]);
    }

    _myButtonNames = _myProjects.slice(0);
    _myButtonNames.push(['_toThumbButton', '_projectThumbnails'], ['_toContactButton', 'contact']);
    _numberOfPrologue = 2;

    _myImageViewersContainerArray = _myButtonNames.slice(0);
    _myImageViewersContainerArray.unshift(['_toClientList', 'clients', '', '']);

    // -- Default Sort Array to be Full Project Array;
    _sotrtedProject = _myProjects;

    // ------------------Initialize
    //_loadProjects();
    // --- Filter
    _createSortButton();
    //_loadMenu();
    //_loadAdditionalSlides();
    //_newStylize();

    createProject(_findCategNumber(window.location.hash.replace("#", "")));

    // Sort with appropriate URL


    if (window.location.hash.replace("#", "") !== "" && _findCategNumber(window.location.hash.replace("#", "")) !== false || isFirstTime === false) {
        refreshIntervalId = setInterval(sortCat, 700);

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

    if(!projectPage)
   		$(window).scroll(function() { scrollFunction(); });
}


// -- for mobile and if it was sheen before
function _movePageImmediately(n) {
    projNumb += n;
    initialPos = -0.5;
    scrollon = true;
    movePage();
    /*for(var i=0; i<_projectDiv.length; i++){
    	_projectDiv[i].css({transform:'scale(1,1)'});
    }*/
}

function _findCategNumber(tag) {

    for (var i = 0; i < _myProjects.length; i++) {
        if (_myProjects[i].id === tag) {
            _currentSortType = 'proj';
            return i + 1000;
        }
    }
    for (var i = 0; i < _myProjectSort.length; i++) {
        if (_myProjectSort[i] === tag) {
            _currentSortType = 'cat';
            return i;
        }
    }
    return false;
}

function sortCat() {
    _sortProject(_findCategNumber(window.location.hash.replace("#", "")));
    closeFilter();
    if (projectPage) {
        if (_currentSortType === 'proj') {
            displaySingleProject();
        }
    } else {
        _movePageImmediately(1);
    }
    clearInterval(refreshIntervalId);
}
