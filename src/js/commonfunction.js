

// check youtube is avaialble and return ID if exists. Otherwise, return false
function isYoutube(url){

	console.log(url);
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
		str = str.replace(/(\r\n|\n|\r)/g,"");
		str = replaceAll(str, ' ', '');
		return str.toLowerCase();
	}
	function _convertStringToArray(str){
		str = str.replace(/(\r\n|\n|\r)/g,"");
		str = replaceAll(str, ' ', '');
		return str.split(',');
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
		
		console.log(url);

		if (hash !== -1) {
			// remove hash value
			url = url.slice(0, hash);

		}

		console.log(parms);
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