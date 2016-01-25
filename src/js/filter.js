
var _currentSort = null;
var _currentSortType = null; // 'cat' or 'proj'

var _sotrtedProject = [];

function _createSortButton(){

	for(var i=0; i<_myProjectSort.length; i++){
		var tempDiv;
		if(i < _myProjectCategories.length){ 
			tempDiv = $('#_headerCategoryMenu');
		}else if(i < (_myProjectCategories.length+_myProjectRoles.length)){
			tempDiv = $('#_headerRoleMenu');
		}else{
			tempDiv = $('#_headerSoftMenu');
		}
			
		tempDiv.append('<li id="_myProjectSort'+String(i)+'" data-numb="'+String(i)+'">'+_myProjectSort[i]+'</li>');
		if(i < _myProjectCategories.length){ 
			$("#_myProjectSort"+String(i)).css({'font-weight':'bold', 'font-family':'Raleway, Helvetica, sans-serif', 'font-size':'3rem', 'margin':'8rem 3rem'});
		}else if(i < (_myProjectCategories.length+_myProjectRoles.length)){
			$("#_myProjectSort"+String(i)).css({'font-style':'italic', 'font-family':'Didot, Helvetica, sans-serif', 'font-size':'6rem', 'margin':'8rem 3rem'});
		}else{
			$("#_myProjectSort"+String(i)).css({'font-style':'italic', 'font-weight':'bold', 'font-family':'Raleway, Helvetica, sans-serif', 'font-size':'2rem', 'margin':'8rem 1rem'});
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
	$('#filterButton').html('Close');

	$('#projectFilter').css({'width':'100%', 'height':'100%'});
	$('#filterOverlay').css({'display':'block', 'width':'100%', 'height':'100%'}).stop().animate({opacity:1});

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
	

	var tempWidth =  $('#filterButton').width() + 100;
	$('#projectFilter').css({'width':tempWidth, 'height':'200px'});
	$('#filterOverlay').stop().animate({opacity:0}, function(){
		$('this').css({'display':'none','width':'0%', 'height':'0%'});
	});
}





function _sortProject(id){

	_sotrtedProject = [];
	_sortedProjectDiv = [];

	

	// id = category id for category // id = project id for project
	if(_currentSort === id || id === false){
		console.log(id, 'AAAAA');
		_currentSort = null;
		_currentSortType = null;
			
		_sortedProjectDiv = _projectDiv;

		for(var j=0; j<_myProjects.length; j++){
			$('#project'+j).css({'opacity':'1', 'display':'inherit'});
		}
		


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
				$('#project'+j).css({opacity:0, 'display':'none'});
			}else{
				$('#project'+j).css({opacity:1, 'display':'inherit'});
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

		
	
	if(_currentSortType == 'proj'){
		projectWasClicked((id-1000));
	}
	
}



function upDateThumbnails(){
	adjustSize();
	animateProject(0, 100);
}