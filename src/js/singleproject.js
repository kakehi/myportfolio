
/*
	Inserting Project Information
*/
function displaySingleProject(){

	$('#notfound').css({'display':'none'});

	var i =_currentSort-1000;

	/*
		Inserting Information
	*/

	/* Project Title */
	$('._projectTitle').text(String(_myProjects[i].title));
	/* Project Subtitle */
	$('._projectSubttle').text(String(_myProjects[i].subtitle));
	/* Project Categories */
	for(var j=0; j<_myProjects[i].cat.length; j++){
		$('.projectCategory ul').append('<li>' + String(_myProjects[i].cat[j]) + '</li>');
	}
	/* Project Meta Information */
	// Client
	$('.projectClient').text(String(_myProjects[i].client));
	// Year
	$('.projectYear').text(String(_myProjects[i].year));
	// Status
	$('.projectStatus').text(String(_myProjects[i].status));
	/* Project Description */
	$('.informationDescription').text(String(_myProjects[i].desc));

	/*
		Inserting Images
	*/
	for(var j=0; j<_myProjects[i].img.length; j++){
		$('.singleProjectImageContainer').append('<div class="_imageViewers"><img src="' + imgLink +String(_myProjects[i].img[j])+'"></div>');
	}


	/*
		Inserting Special Contents
	*/
	if(_myProjects[i].special !== "")
		$('.singleProjectImageContainer').append(_myProjects[i].special);
}


/* 
	Navigation animation 
*/
var timer;
$(window).scroll(function(){

	if(isMobile === false){
		timer = setTimeout(function() {
			if($(window).scrollTop() > 200 )
				$('header nav').removeClass('headerClosed').addClass('headerOpened');
			else
				$('header nav').removeClass('headerOpened').addClass('headerClosed');

		}, 100);
	}

});


/* 
	Navigation Links
*/
// -- Expand / Contract Image
var imageExpanded = false;
$('#linkImage').text('Images ++');
$('.linkImage').click(function(){
	if(!imageExpanded){
		$('.singleProjectImageContainer').removeClass('sizeDefault').addClass('sizeExpanded');
		imageExpanded = true;
		$('#linkImage').text('Images --');
	}else{
		$('.singleProjectImageContainer').removeClass('sizeExpanded').addClass('sizeDefault');
		imageExpanded = false;
		$('#linkImage').text('Images ++');
	}
});
