

function displaySingleProject(){

	$('#notfound').css({'display':'none'});

	var i =_currentSort-1000;

	$('._imageTextBox').append('<div><h1 class="_projectTitle">' + String(_myProjects[i].title) + '</h1><h2 class="_projectSubttle">' + String(_myProjects[i].subtitle) + '</div><div style="width:100%; max-width:1280px; border-bottom:solid thin #CCC; border-top:solid thin #CCC; padding:50px 0px;"><div id="informationList"><div class="informationList">Client : ' + String(_myProjects[i].client) + '</div><div class="informationList">Year : ' + String(_myProjects[i].year) + '</div><div class="informationList">Status : ' + String(_myProjects[i].status) + '</div></div><div class="informationDescription">' + String(_myProjects[i].desc) + '</div><div style="clear: both;"></div> </div>');


	for(var j=0; j<_myProjects[i].img.length; j++){
		$('._imageTextBox').append('<div class="_imageViewers"><img src="' + imgLink +String(_myProjects[i].img[j])+'"></div>');
					
	}

	if(_myProjects[i].special !== ""){
		$('._imageTextBox').append(_myProjects[i].special);
	}
}


var timer = false;
$(window).scroll(function(){

	if(isMobile === false){
	if (timer !== false && $(window).scrollTop() > 200 ){
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
        if($(window).scrollTop() > 200 ){
			timer = true;
			$('header nav').stop().animate({'height':'72px'}, function(){
				timer = false;
			});
		}else{
			timer = true;
			$('header nav').stop().animate({'height':'0px'}, function(){
				timer = false;
			});
		}

    }, 100);
	}

});