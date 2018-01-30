
/*
// -- Array of filter elements
	name : name of the filter
	id : id in number from entire filters
	nameid : name that is optimized for the filter;
*/
// -- Array for All Filter Elements
var _$filterObjects;
// -- Array for Actie Filter Elements
var _$activeFilterObjects = [];
// -- Array for Category, Role and Software
var _$catArray, _$roleArray, _$softArray;


// -- Current Sort Type could be 'cat', 'role', 'soft' or 'proj'
var _$currentSortType = null;



// -- Receive datas from App controller's HTTP request
function _CreateFilterDB(CatDB, RoleDB, SoftDB){


	_$catArray = CreateObjectArray(_ConvertStringToArray(CatDB.gsx$content.$t, false),"cat", 0);
    _$roleArray = CreateObjectArray(_ConvertStringToArray(RoleDB.gsx$content.$t, false), "role", _$catArray.length);
    _$softArray = CreateObjectArray(_ConvertStringToArray(SoftDB.gsx$content.$t, false), "soft", _$roleArray.length);

    // -- Concatinating arrays
    _$filterObjects = _$catArray.concat(_$roleArray).concat(_$softArray)


    // -- Simply Creating Arrays
    function CreateObjectArray(Arr, Type, CountOfLastArray){

    	var _Array = [];
    	// -- Creating the Filter Objects

    	 for(var i=0; i<Arr.length; i++){

	    	var Obj = {
	    		type: Type,
	    		name: Arr[i],
	    		id: (i + CountOfLastArray),
	    		nameid:_convertStringToID(Arr[i])
	    	}

	    	_Array.push(Obj);

	    }

	    return _Array;
    }

}


// -- Sort Project By Filter

function _SortProjectByFilter(Filter){

	_$sortedProjects = [];

	// id = category id for category // id = project id for project
	if(_currentSort === Filter.nameid || Filter == null){
		_currentSort = null;
		_$currentSortType = null;
			
		_$sortedProjects = _$projects;

		for(var j=0; j<_$projects.length; j++){
			$('#project'+j).css({'display':'inherit'});
		}
		
		location.hash = "";

		/*
			Adjust Button 1
		*/
		// -- Activate All Buttons
		$('.sortButton').removeClass('unselected').addClass('selected');
		

	}else{
		location.hash = _currentSort = Filter.nameid;
		_$currentSortType = Filter.type;

		for(var j=0; j<_$projects.length; j++){
				
			var amICategorized = false;
				
			// Mark: if category tab was clicked search through each projects' categories. if project tab was clicked understand which project you are in.
			if(_$currentSortType == 'cat' || _$currentSortType == 'role' ){
				var k = 0;
				while(k<_$projects[j].cat.length){
					if(Filter.nameid == _convertStringToID(_$projects[j].cat[k])){
						amICategorized = true;
						_$sortedProjects.push(_$projects[j]);
						k = _$projects[j].cat.length;
					}else{
						k++;
					}
				}
			}

			// -- animate to thumbnails
			if(amICategorized != true){
				$('#project'+j).css({'display':'none'});
			}else{
				$('#project'+j).css({'display':'inherit'});
			}
		}


		/*
			Adjust Button 2
		*/
		// -- Deactivate All Buttons
		$('.sortButton').removeClass('selected').addClass('unselected');
		// -- Activate Selected Button
		$('#_myProjectSort'+ Filter.nameid).removeClass('unselected').addClass('selected');

		/* TODO Scroll Top Especially for Footer. Otherwise, reload the page */
		// -- Scroll of Window to Top, Wait for all thumbnails to fit in page
	
	}
	

	/*
		Toggle Opened / Closed Class for All Projects
	*/
	for(var i=0; i<_$projects.length; i++) {

		var j=0; 
		while(j<_$sortedProjects.length){

			if(_$projects[i] == _$sortedProjects[j]){
				$('#project' + _$projects[i].id).css({
					'-webkit-transform': 'scale(1,1)',
					'-moz-transform': 'scale(1,1)',
					'-ms-transform': 'scale(1,1)',
					'-o-transform': 'scale(1,1)',
					'transform': 'scale(1,1)'
				});
				//$('#project' + _$projects[i].id).removeClass('closed').addClass('opened');
				j = _$sortedProjects.length;
			}
			if(j == _$sortedProjects.length - 1){
				$('#project' + _$projects[i].id).css({
					'-webkit-transform': 'scale(0,0)',
					'-moz-transform': 'scale(0,0)',
					'-ms-transform': 'scale(0,0)',
					'-o-transform': 'scale(0,0)',
					'transform': 'scale(0,0)'
				});
				//$('#project' + _$projects[i].id).removeClass('opened').addClass('closed');
			}
			j++;
		}
	}

	upDateThumbnails();
	
}


function upDateThumbnails(){
	
	adjustSize_perPage();

	setTimeout(animateProject(0, 100), 200);

}



/*
// -- Check My current URL to sort
*/

function _CheckMySortFromURL(){

	// -- Check from Filter Array
	var i=0;
	var filterNumb=0;
	while(i<_$filterObjects.length){
		if(window.location.hash.replace("#/", "")===_$filterObjects[i].nameid){
			_SortProjectByFilter( _$filterObjects[i] );
			filterNumb ++;
			i = _$filterObjects.length;
		} else {
			i++;
		}
	}
	
	// -- If the page is at top level, and filter is applied
    if (_$currentPageType == "top" && filterNumb > 0) {
        _showGridImmediately();
    }

}





///////////////////////////////////////




var _currentSort = null;




