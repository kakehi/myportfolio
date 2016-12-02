
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



}






////////////////////////////

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
	//$('._projectTitle').text(String(_myProjects[i].title));
	/* Project Subtitle */
	//$('._projectSubttle').text(String(_myProjects[i].subtitle));
	/* Project Categories */
	var j=0;
	while(j<_myProjects[i].cat.length){
		var k=0;
		while(k<_myProjectCategories.length){
			if(_myProjectCategories[k] == _myProjects[i].cat[j]){
				$('.projectCategory ul').append('<li class="projectCat">' + String(_myProjects[i].cat[j]) + '</li>');
				k = _myProjectCategories.length;
			}else{
				k++;
			}
		}
		k=0;
		while(k<_myProjectRoles.length){
			if(_myProjectRoles[k] == _myProjects[i].cat[j]){
				$('.projectCategory ul').append('<li class="projectRole">' + String(_myProjects[i].cat[j]) + '</li>');
				k = _myProjectRoles.length;
			}else{
				k++;
			}
		}
		k=0;
		while(k<_myProjectSofts.length){
			if(_myProjectSofts[k] == _myProjects[i].cat[j]){
				$('.projectCategory ul').append('<li class="projectSoft">' + String(_myProjects[i].cat[j]) + '</li>');
				k = _myProjectSofts.length;
			}else{
				k++;
			}
		}
		j++;
	}
	/* Project Meta Information */
	// Client
	//$('.projectClient').text(String(_myProjects[i].client));
	// Year
	//$('.projectYear').text(String(_myProjects[i].year));
	// Status
	//$('.projectStatus').text(String(_myProjects[i].status));
	/* Project Description */
	//$('.informationDescription').append(String(_myProjects[i].desc));

	/*
		Inserting Images
	*/
	/*for(var j=0; j<_myProjects[i].img.length; j++){
		$('.singleProjectImageContainer').append('<div class="_imageViewers"><img src="' + imgLink +String(_myProjects[i].img[j])+'"></div>');
	}*/


	/*
		Inserting Special Contents
	*/
	//if(_myProjects[i].special !== "")
	//	$('.singleProjectImageContainer').append(_myProjects[i].special);
}





