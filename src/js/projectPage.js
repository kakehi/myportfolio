
/*
	Project Core
*/
// -- Single Project From API
var _$singleProjectData;



/*
	Runs after the data is loaded and after angular is ran
*/
function _PerPageJustLoaded(){
	
	/*
		Initial Animation
	*/
	$('.angularFade').addClass('opened');
	$('.detailInformationContainer .line').addClass('opened');
	// -- Line dividing meta detais and descriptions. Only visible in small resolution
	$('#informationList .line').addClass('opened');

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

}	


////////////////////////////////////



function createProject(){

	//createFooter($('body'));	

}

function animateProject(d, speed){
	


}










function adjustSize_perPage(){

	// Make Sure Video Is Within Page Size
	$('.projectVideo').css({'max-width':_$windowWidth});

}



