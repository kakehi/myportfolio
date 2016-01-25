// -------------- LOADING DATABASE -----------------------
	var _isItTouchDevice;
	
	
	var _pageType = $_GET('type');
	
	/* inherit sizes and distances*/
	var _hoverSideButtonWidth;
	var _hoverSideButtonOpenWidth;
	var _hoverSideButtonOpacity;
	
	var targetMenuWidth;
	var animatingIntervalTime;
	
	
	var _clientlist;
	
	var _youtubeurl;
		
	/* -- buttons --*/
	
	var _myProjectSort, _myProjectCategories, _myProjectRoles, _myProjectSofts;


	function $_GET(param) {
		
		var query_string = {};
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");

					// If first entry with this name
				if (typeof query_string[pair[0]] === "undefined") {
				  query_string[pair[0]] = decodeURIComponent(pair[1]);
					// If second entry with this name
				} else if (typeof query_string[pair[0]] === "string") {
				  var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
				  query_string[pair[0]] = arr;
					// If third or later entry with this name
				} else {
				  query_string[pair[0]].push(decodeURIComponent(pair[1]));
				}
			  }
			 if(!query_string[param]){
				 return false;
			 }else{
				 return query_string[param];
			 }
	}
	
	function _loadJSON(urlkey, sheetkey){
			
			// -- assign default if no value
			console.log(urlkey);

			if(urlkey === false){
				urlkey = '1LjdZTcQD3IiaL55n-W1PN2naSrYEN0THl5KKe7HlTiI';
			}
			
			var apiURL = "https://spreadsheets.google.com/feeds/list/" + urlkey + "/" + sheetkey + "/public/values";
			apiURL = apiURL + "?alt=json-in-script&callback=?";
			console.log(apiURL);
			
			$.ajax({
				type: 'GET',
				url: apiURL,
				cache: false,
				dataType: 'jsonp',
				jsonp : 'myFunc',
				success: function(json, textStatus) {
					
					_createDatabase(json);
					
				},
				error: function(xhr, textStatus, errorThrown) {
					console.log(textStatus);
				}
			
			});
	}

	
	var _myProjects = [];
	var _sotrtedProject = [];
	var _myButtonNames, _myImageViewersContainerArray;
	var _numberOfPrologue = 2;
	
	/*-- sorting -- */
	
	var _currentSort = null;
	var _currentSortType = null; // 'cat' or 'proj'
	

	function _createDatabase(json){
			
			/* -- populate pages --*/
			/* -- populate pages --*/
			/* -- populate pages --*/
			
			_clientlist = _convertStringToArray(json.feed.entry[0].gsx$content.$t);
			
			_myProjectCategories = _convertStringToArray(json.feed.entry[1].gsx$content.$t);
			_myProjectRoles = _convertStringToArray(json.feed.entry[2].gsx$content.$t);
			_myProjectSofts = _convertStringToArray(json.feed.entry[3].gsx$content.$t);
		
			_youtubeurl = json.feed.entry[4].gsx$content.$t; 

			/* -- projects --*/
			
			var _projectCount = parseInt(json.feed.entry[5].gsx$content.$t);
			var _projectCounter = 0;
			for(var i=6; i<6 + 12 * _projectCount; i+=12){
				
				// -- exclude if exlucde flag is on
				
				var _pageTypeQuery = "y";
				if(_pageType === 'mkkpn' || _pageType === false){
					_pageTypeQuery = json.feed.entry[i].gsx$mkkpn.$t;
				}else if(_pageType === 'xrva5'){
					_pageTypeQuery = json.feed.entry[i].gsx$xrva5.$t;
					
				}else if(_pageType === 'epaz'){
					_pageTypeQuery = json.feed.entry[i].gsx$epanz.$t;
				}
				if(_pageTypeQuery !== ""){
					
					var projectArray = [];
					var project = {};
					/* -- information --*/
					project.buttonid = '_to' + _convertStringToID(String(json.feed.entry[i].gsx$content.$t)) + 'Button'; // id
					project.id = _convertStringToID(String(json.feed.entry[i].gsx$content.$t)); // id
					project.title = String(json.feed.entry[i].gsx$content.$t); // title
					project.subtitle = String(json.feed.entry[1+i].gsx$content.$t); // subtitle
					project.client = String(json.feed.entry[2+i].gsx$content.$t); // client
					project.year = String(json.feed.entry[3+i].gsx$content.$t); // Year
					project.status = String(json.feed.entry[4+i].gsx$content.$t); // Status
					project.header = String(json.feed.entry[6+i].gsx$content.$t); // HeeaderImage
					project.desc = String(json.feed.entry[7+i].gsx$content.$t); // Description
					/*projectArray[7] = "";
					projectArray[8] = "";
					/* -- information --*/
					
					
					
					/* -- category --*/
					project.cat = _convertStringToArray(json.feed.entry[8+i].gsx$content.$t);
					/* -- category --*/
					
					/* -- thumb --*/
					project.thumb = json.feed.entry[9+i].gsx$content.$t;
					/* -- thumb --*/
					
					/* -- images --*/
					project.img = _convertStringToArray(json.feed.entry[10+i].gsx$content.$t);
					/* -- images --*/
					
					/* -- special contents --*/
					project.special = json.feed.entry[11+i].gsx$content.$t;
					/* -- special contents --*/
					
					_myProjects.push(project);
					
				}
				
				_projectCounter ++;
									
			}
			
			/* -- projects --*/
			
			_myProjectSort = _myProjectCategories.slice(0);
			for(i=0; i<_myProjectRoles.length; i++){
				_myProjectSort.push(_myProjectRoles[i]);
			}
			for(i=0; i<_myProjectSofts.length; i++){
				_myProjectSort.push(_myProjectSofts[i]);
			}
		
			_myButtonNames = _myProjects.slice(0);
			_myButtonNames.push(['_toThumbButton','_projectThumbnails'],['_toContactButton','contact']);
			_numberOfPrologue = 2;
	
			_myImageViewersContainerArray = _myButtonNames.slice(0);
			_myImageViewersContainerArray.unshift(['_toClientList','clients','', '']);
			
			// -- Default Sort Array to be Full Project Array;
			_sotrtedProject = _myProjects;
			
			// ------------------Initialize
			//_loadProjects();
			// --- Filter
			_createSortButton();
			//_loadMenu();
			//_loadAdditionalSlides();
			//_newStylize();

			createProject();

			// Sort with appropriate URL
			if(window.location.hash.replace("#", "")!=="" && _findCategNumber(window.location.hash.replace("#", ""))!== false){
				var refreshIntervalId = setInterval(sortCat, 2000); 
				function sortCat(){
					_sortProject(_findCategNumber(window.location.hash.replace("#", "")));
					clearInterval(refreshIntervalId);
				}
			}
			
			$(window).scroll(function(){scrollFunction();});
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
	// -------------- COMMON -----------------------