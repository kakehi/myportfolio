

/*
	Get Current Project From project nameid
*/
function _GetProjectFromNameID (Nameid){
	
	// -- If there is no match, returm false
	var Project = false;

	var i=0;
	while(i<_$projects.length){
		if(Nameid === _$projects[i].id){
			Project = _$projects[i];
			i = _$projects.length;
		}else{
			i++;
		}
	}
	return Project;
}

/*
	Return Filter Object By Passing NameID
*/
function _ReturnFilterObject(Nameid){
	
	// -- If there is no match, returm false
	var Obj = false;

	var i=0;
	while(i<_$filterObjects.length){
		if(Nameid === _$filterObjects[i].nameid){
			Obj = _$filterObjects[i];
			i = _$filterObjects.length;
		}else{
			i++;
		}
	}
	return Obj;
}


/*
	Check if element has a class
*/
function _HasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


/*
	Split Strings Divided by Comma into Array
*/
function _ConvertStringToArray(str, RemoveAllSpaces){
	var arr = [];
	str = str.replace(/(\r\n|\n|\r)/g,"");
	
	// For file names, to avoid mistakes, remove all spaces unconditionally.
	if(RemoveAllSpaces)
		str = replaceAll(str, ' ', '');
	else
		str = replaceAll(str, ', ', ',');
	
	arr =  str.split(',');
	
	// Check if it was empty string. In that case, the result of array should be [""] (arr.length == 1) instead of [] (arr.length == 0)
	if(arr.length == 1 && arr[0] == "")
		return (arr = []);
	else
		return arr;
}
//////////////////////////////

//////////////////////////////

//////////////////////////////



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


var refreshIntervalId;



// -- for mobile and if it was sheen before
function _movePageImmediately(n) {
    _$heroCounter += n;
    initialPos = -0.5;
    scrollon = true;
    movePage();
    /*for(var i=0; i<_projectDiv.length; i++){
    	_projectDiv[i].css({transform:'scale(1,1)'});
    }*/
}




/*
	TOUCH Functions
*/
// -- https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
var xDown = null;                                                        
var yDown = null;  
function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {


	// Check that the animation is too close to each other
	_$bAnimation =  true;


    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */ 
        } else {
            /* right swipe */
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
            perPageUpSwipe();
        } else { 
            /* down swipe */
            perPageDownSwipe();
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};



// check youtube is avaialble and return ID if exists. Otherwise, return false
function isYoutube(url){

	if (url.indexOf("youtube.com") === -1){
		return false;
	}else{
		var vars = {};
		url.replace( 
			/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
			function( m, key, value ) { // callback
				vars[key] = value !== undefined ? value : '';
				if(vars[key] !== undefined){
					url = vars[key];
				}
			}
		)
		return url;
	}
			
}



	// -------------- COMMON -----------------------
	function _convertStringToID(str){
		if(!str)return false; // return if some undefined was sent
		str = str.replace(/(\r\n|\n|\r)/g,"");
		str = replaceAll(str, ' ', '');
		return str.toLowerCase();
	}

	function replaceAll(str, find, replace1) {
		 return str.replace(new RegExp(find, 'g'), replace1);
	}
	 function processAjaxData(response, urlPath){
		 document.getElementById("content").innerHTML = response.html;
		 document.title = response.pageTitle;
		 window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
	 }
	 function getParmsFromURL(url) {
		var parms = {}, pieces, parts, i;
		var hash = url.lastIndexOf("#");

		if (hash !== -1) {
			// remove hash value
			url = url.slice(0, hash);

		}

		return parms;
	}
	function getParam(param) {
	        var vars = {};
	        var url = window.location.href;
	        var hash = url.lastIndexOf("#");
	    	if (hash !== -1) {
	        	// remove hash value
	        	url = url.slice(0, hash);
	    	}
	        url.replace(
	                /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
	                function( m, key, value ) { // callback
	                        vars[key] = value !== undefined ? value : '';
	                }
	        );

	        if ( param ) {
	                return vars[param] ? vars[param] : null;
	        }
	        return vars;
	}
	// -------------- COMMON -----------------------