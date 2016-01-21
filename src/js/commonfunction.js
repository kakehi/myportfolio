

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