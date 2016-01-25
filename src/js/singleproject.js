

function displaySingleProject(){

	$('#notfound').css({'display':'none'});

	var i =_currentSort-1000;

	$('._imageTextBox').append('<div style="padding-bottom:60px;"><h1 class="_projectTitle">' + String(_myProjects[i].title) + '</h1><h2 class="_projectSubttle">' + String(_myProjects[i].subtitle) + '</div><div style="width:100%; max-width:1280px; border-bottom:solid thin #CCC; border-top:solid thin #CCC; padding:50px 0px;"><div style="width:30%; float:left;"><div class="informationList">Client : ' + String(_myProjects[i].client) + '</div><div class="informationList">Year : ' + String(_myProjects[i].year) + '</div><div class="informationList">Status : ' + String(_myProjects[i].status) + '</div></div><div class="informationDescription" style="width:65%; float:right;">' + String(_myProjects[i].desc) + '</div><div style="clear: both;"></div> </div>');


	for(var j=0; j<_myProjects[i].img.length; j++){
		$('._imageTextBox').append('<div class="_imageViewers"><img src="' + imgLink +String(_myProjects[i].img[j])+'"></div>');
					
	}
}
