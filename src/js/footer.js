function createFooter(div){


	div.append('<footer style="display:none; opacity:0;"></footer>');


	$('footer').append('<div class="outercontainer"><div class="innercontainer1"></div><div class="innercontainer2"></div><div class="innercontainer3"></div><div class="clear"></div></div>');

	$('footer .innercontainer1').append('<h3>Projects</h3><div><ul></ul></div>');
		_projectDiv.push($('#projectContainer').find('#project'+i));
	for(var i=0; i<_myProjects.length; i++){
		$('footer .innercontainer1 ul').append('<li id="_footerProject'+String(i)+'" data-numb="'+String(i)+'"><section><a class="animatedunderline">'+_myProjects[i].title+'</a></section></li>');
	}

	$('footer .innercontainer3').append('<h3>Sitemap</h3><div><ul><li><section><a id="linktotop" class="linktotop" class="animatedunderline">Top</a></section></li><li class="linktoproject" id="linktoproject"><section><a class="animatedunderline">Projects</a></section></li><li class="footerprojectfilter"><ul></ul></li><li><section><a class="animatedunderline" href="mailto:takuma.kakehi@gmail.com">Contact</a></section></li></ul></div>');

	for(var i=0; i<_myProjectSort.length; i++){
		if(i < _myProjectCategories.length){ 
			$('.footerprojectfilter ul').append('<li id="_footerProjectSort'+String(i)+'" data-numb="'+String(i)+'"><section><a class="animatedunderline">'+_myProjectSort[i]+'</a></section></li>');
		}
	}

	/* CLICK */


	for(var i=0; i<_myProjects.length; i++){
		$('#_footerProject'+String(i)).click(function(){
			if(projectPage === true){
				window.location.hash =_convertStringToID(_myProjects[$(this).data('numb')].title);
				window.location.reload();
			}else{
				 _linkFromFooter(_convertStringToID(_myProjects[$(this).data('numb')].title), false, false);
			}
		});
	}

	$('#linktoback').click(function(){
		window.history.back();
	});
	$('.linktotop').click(function(){
		_linkFromFooter(false, true, true);

	});

	$('.linktoproject').click(function(){

		_linkFromFooter(false, false, true);

	});

	for(var i=0; i<_myProjectSort.length; i++){

		if(i < _myProjectCategories.length){ 
			$('#_footerProjectSort'+String(i)).click(function(){

				_linkFromFooter(_convertStringToID(_myProjectSort[$(this).data('numb')]), false, true);
				
			})
		}
	}


	/* Appear Movies */
	$('footer').css({'display':'inherit'}).delay(1000).animate({opacity:1});
}

function _linkFromFooter(hash, top, home){

	var dest = "", hashparam = "", param = getParam('type');

	if(projectPage === true && home === true){
		dest = "index.html";
	}

	if(projectPage === false && home === false){
		dest = "project.html";
	}


	if(top === true){
		$.cookie('visited', null);
	}

	if(hash){
		hashparam = '#' + hash;
	}

	if(param){
		dest = dest + ("?type=") + getParam('type') + hashparam;
	}else{
		dest = dest + hashparam;
	}

	window.location.href = dest;
}