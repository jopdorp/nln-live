var socket = io.connect()
window.socket = socket;
$.get('/performance/subscribe',{performanceId:$.url().param('performance')},function(performance){
    console.log("performance",performance);
    window.performance = performance;
});

socket.on('message', function (message) {
    if(message.model == 'performance' && message.verb == "conduct"){
        var newFragmentPath = getFragmentPath(
            message.data.piece,
            message.data.currentFragments[1],
            message.data.scoreType,
            $.url().param('instrument')
        );
        $('.fragment').toggleClass("current-fragment");
        changeScore($('.fragment:not(.current-fragment)'), newFragmentPath, message.data.scoreType);
    }
});

$(document).ready(function () {
    initializeNotesDisplay(decodeURIComponent($.url().param('instrument')));
    $(window).resize(window.debouncedRefreshScores);
});

function initializeNotesDisplay(instrument) {

    preloadImages(instrument,function(){
        socket.get("/performance/"+$.url().param('performance'),{}, function(data) {
            window.scoreType = data.scoreType;
            console.log("currentFragments on initialize",data);
            changeScore(
                $('.fragment:not(.current-fragment)'),
                getFragmentPath(
                    data.piece,
                    data.currentFragments[1],
                    data.scoreType,
                    $.url().param('instrument')
                )
            );
            changeScore(
                $('.fragment.current-fragment')
                ,getFragmentPath(
                    data.piece,
                    data.currentFragments[0],
                    data.scoreType,
                    $.url().param('instrument')
                )
            );
        });
    });
}


function changeScore(element, scorePath, type, redraw) {
    if (element.data("score-path") != scorePath || redraw) {
        element.data("score-path", scorePath);

        if (type === "xml") {
            return changeScoreXml(element, scorePath);
        } else if (type === "img") {
            return changeScoreImg(element, scorePath);
        }
    }
}

window.debouncedRefreshScores = _.debounce(function () {
    _.each($('.fragment'), function (fragment) {
        changeScore($(fragment), $(fragment).data("score-path"), window.scoreType, true)
    });
}, 250);

function changeScoreImg(element, newFragmentPath) {
    console.log("newFragmentPath: " + newFragmentPath);
    if (document.loadedImages) {
        if ((typeof document.loadedImages[newFragmentPath]) == "object") {
            if (($(".fragment div")[0] == document.loadedImages[newFragmentPath][0] ||
                $(".fragment div")[1] == document.loadedImages[newFragmentPath][0])) {
                $(element).html(document.loadedImages[newFragmentPath].clone());
            } else {
                $(element).html(document.loadedImages[newFragmentPath]);
            }
        }
    } else {
        $(element).css('background-image', 'url(' + newFragmentPath + ')');
    }

}

function getFragmentPath(piece, fragment, scoreType,instrument) {
    if(!instrument){
        instrument = "conductor";
    }
    var path = "../pieces/" + piece + "/" + instrument + "/" + fragment;
    if(scoreType == "img"){
        path += ".png"
    }
    console.log(path);
    return path;
}

function preloadImages(instrument, done) {
    document.loadedImages = [];
    var piece = $.url().param('piece');
    $.get("/musicalblock/allfor?instrument=" + instrument + "&piece=" + piece, function (data) {
            console.log("all musical blocks: ", data);
            var imageLoader = $("<div id='image-Loader'/>");
            for (i in data) {
                var path = "../pieces/" + piece + "/" + instrument + "/" + data[i].imageFile;
                document.loadedImages[path] = $("<div/>")
                    .css('background-image', 'url(' + path + ')');
                imageLoader.append(document.loadedImages[path]);
            }
            $("body").append(imageLoader)
            $("#imageLoader").remove();
            if(done){
                done();
            }
        }
    );

}
