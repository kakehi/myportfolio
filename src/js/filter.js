
var _currentSort = null;
var _currentSortType = null; // 'cat' or 'proj'

var _sotrtedProject = [];

function _createSortButton(){

	for(var i=0; i<_myProjectSort.length; i++){
		var tempDiv;
		if(i < _myProjectCategories.length){ 
			tempDiv = $('#_headerCategoryMenu');
			tempDiv.append('<span id="_myProjectSort'+String(i)+'" data-numb="'+String(i)+'"><a class="animatedunderline black">'+_myProjectSort[i]+'</a></li>');
		}else if(i < (_myProjectCategories.length+_myProjectRoles.length)){
			tempDiv = $('#_headerRoleMenu');			
			tempDiv.append('<span id="_myProjectSort'+String(i)+'" data-numb="'+String(i)+'"><a class="animatedunderline black">'+_myProjectSort[i]+'</a></li>');
		}else{
			//tempDiv = $('#_headerSoftMenu');
			//tempDiv.append('<span id="_myProjectSort'+String(i)+'" data-numb="'+String(i)+'">'+_myProjectSort[i]+'</li>');
		}
			
			
		$('#_myProjectSort'+ String(i)).click(function(evt){
			_currentSortType = 'cat';
			evt.preventDefault();
			location.hash = _myProjectSort[parseInt($(this).attr('data-numb'))];
			_sortProject(parseInt($(this).attr('data-numb')));
		});
	}
}


/* --- Filter Open and Close --- */
var filterOpen = false;

function openFilter(){
	filterOpen = true;

	// turn on the filter tag
	//$('#projectFilter').css({'width':'100%', 'height':'100%'});
	$('.filterOverlay').removeClass('filterClosed').addClass('filterOpened');
	$('.filterTexts, #_headerCategoryMenu, #_headerRoleMenu, #_headerSoftMenu').removeClass('filterClosed').addClass('filterOpened');

}
function closeFilter(){
	filterOpen = false;
	
	// turn on the filter tag
	if(_currentSort){
		$('#filterButton').html('Filter : ' + _myProjectSort[_currentSort]);
	}else{	
		// turn off the filter tag
		$('#filterButton').html('Filter');
	}
	
	var tempWidth =  $('#filterButton').width() + 200;
	//$('#projectFilter').css({'width':tempWidth, 'height':'200px'});
	$('.filterOverlay').removeClass('filterOpened').addClass('filterClosed');
	$('.filterTexts, #_headerCategoryMenu, #_headerRoleMenu, #_headerSoftMenu').removeClass('filterOpened').addClass('filterClosed');
}





function _sortProject(id){

	_sotrtedProject = [];
	_sortedProjectDiv = [];

	

	// id = category id for category // id = project id for project
	if(_currentSort === id || id === false){
		_currentSort = null;
		_currentSortType = null;
			
		_sortedProjectDiv = _projectDiv;

		for(var j=0; j<_myProjects.length; j++){
			$('#project'+j).css({'display':'inherit'});
		}
		
		location.hash = "";

	}else{
		_currentSort = parseInt(id);
	
		for(var j=0; j<_myProjects.length; j++){
				
			var amICategorized = false;
				
			// Mark: if category tab was clicked search through each projects' categories. if prject tab was clicked understand which project you are in.
			if(_currentSortType == 'cat'){
				var k = 0;
				while(k<_myProjects[j].cat.length){
					if(_myProjectSort[_currentSort] == _myProjects[j].cat[k]){
						amICategorized = true;
						_sotrtedProject.push(_myProjects[j]);
						_sortedProjectDiv.push(_projectDiv[j]);
						k = _myProjects[j].cat.length;
					}else{
						k++;
					}
				}
				/*for(var k=0; k<_myProjects[j].cat.length; k++){
					if(amICategorized == false){
						if(_myProjectSort[_currentSort] == _myProjects[j].cat[k]){
							amICategorized = true;
							_sotrtedProject.push(_myProjects[j]);
						}
					}
				}*/
			}else if(j+1000 == id){
				amICategorized = true;
			}

			// -- animate to thumbnails
			if(amICategorized != true){
				$('#project'+j).css({'display':'none'});
			}else{
				$('#project'+j).css({'display':'inherit'});
			}
		}
	
	}
	// -- turn off other buttons
	for(var j=0; j<_myProjectSort.length; j++){
		if(_currentSort != j && _currentSort != null){
			$('#_myProjectSort'+ String(j)).stop().animate({'opacity':'.25'});
		}else{
			$('#_myProjectSort'+ String(j)).stop().animate({'opacity':'1'});
		}
	}

	upDateThumbnails();
	
	/*if(_currentSortType == 'proj'){
		projectWasClicked((id-1000));
	}*/
	
}



function upDateThumbnails(){
	adjustSize();
	animateProject(0, 100);
}