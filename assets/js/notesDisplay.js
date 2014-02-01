socket.on('play-next-fragment', function (data) {
	console.log("caught play-next-fragment",data);
	var newFragmentPath = getFragmentPath(data.piece,data.fragments[1],data.scoreType);
	$('.fragment').toggleClass("current-fragment");	
	changeScore($('.fragment:not(.current-fragment)'),newFragmentPath,data.scoreType);
});

$(document).ready(function(){
	initializeNotesDisplay($.url().param('instrument'));
    $( window ).resize(window.debouncedRefreshScores);
});

function initializeNotesDisplay(instrument){
	preloadImages(instrument,function(){
	    $.get("/currentFragments", function(data) {
            window.scoreType = data.scoreType;
	        console.log("currentFragments on initialize",data);
	        changeScore(
	            $('.fragment:not(.current-fragment)'),
	            getFragmentPath(data.piece,data.fragments[1],data.scoreType)
	            ,data.scoreType);
	        changeScore(
	            $('.fragment.current-fragment')
	            ,getFragmentPath(data.piece,data.fragments[0],data.scoreType)
	            ,data.scoreType);
	     });	
	});
}


function changeScore(element,scorePath,type,redraw){
	if(element.data("score-path") != scorePath || redraw){
		element.data("score-path",scorePath);
	
   		if(type === "xml"){
        	return changeScoreXml(element,scorePath);
    	}else if(type === "img"){
        	return changeScoreImg(element,scorePath);
    	}
	}
}

window.debouncedRefreshScores = _.debounce(function(){
    _.each($('.fragment'),function(fragment){
        changeScore($(fragment),$(fragment).data("score-path"),window.scoreType,true)
    });
},250);

function changeScoreXml(element,scoreXmlPath){
        $.get(scoreXmlPath, function(data) {
        	console.log(data);
			var doc = new Vex.Flow.MusicXML.Document(data);
          	var VexFlow_Viewer = new Vex.Flow.MusicXML.Viewer($(element)[0], doc);
            $(element).prepend('<div class="vertical-aligner"></div>');
            return VexFlow_Viewer;
        });
}

function changeScoreImg(element,newFragmentPath){
	console.log("newFragmentPath: " + newFragmentPath);
	if(document.loadedImages){
		if((typeof document.loadedImages[newFragmentPath]) == "object"){
			if(($(".fragment div" )[0] == document.loadedImages[newFragmentPath][0] ||
				$(".fragment div" )[1] == document.loadedImages[newFragmentPath][0])  ){
				$(element).html(document.loadedImages[newFragmentPath].clone());
			}else{
				$(element).html(document.loadedImages[newFragmentPath]);
			}
		}
	}else{
		$(element).css('background-image', 'url(' + newFragmentPath + ')');
	}

}

function getFragmentPath(piece,fragment,scoreType){
	var instrument = "conductor";
	if($("#instrument-select").size() > 0){
		instrument = $("#instrument-select").val();
	}
    var path = "/"+scoreType+"fragments/"+piece+"/"+instrument+"/"+fragment;
    console.log(path);
	return path;
}

function preloadImages(instrument,done){
	document.loadedImages = [];
	$.get("/allimages/"+instrument+"/",function(data){
			console.log("allimages: ",data);
			var imageLoader = $("<div id='image-Loader'/>");
			for(i in data){
				document.loadedImages[data[i]] = $("<div/>").css('background-image', 'url(' +  data[i] + ')');
				imageLoader.append(document.loadedImages[data[i]]);
			}
			$("body").append(imageLoader)
			$("#imageLoader").remove();
			done();
	});

}
