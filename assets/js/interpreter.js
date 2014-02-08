var groups;
socket.get('/performance/subscribe',{performanceId: $.url().param('performance')}, function(performance){
    console.log("performance", performance);

    socket.get('/piece/subscribe', {pieceId: performance.piece}, function(piece){
        console.log("piece", piece);
        groups = piece.groups.length;
    });
    
});

socket.on('message', function (message) {
    if(message.model == 'performance'){
        $(".gamevar-slider").val(message.data.gameplayState);
    }
});

$(document).ready(function () {
    $(".content-container").hide();
    $(".login-form").submit(onLoginSubmit);
    $(".gamevar-slider").change(onSliderChange);
    createButtons();
});

function onLoginSubmit(event) {
    event.preventDefault();

    if ($(".password-input").val() == "LetMeIn") {
        $(".content-container").show();
        $(".login-container").hide();
    } else {
        alert("The password is incorrect.");
    }
}

function onSliderChange(event) {
    console.log("about to emit setgameplaystate: " + $(event.currentTarget).val());
    socket.put('/performance/'+$.url().param('performance'), { gameplayState: $(event.currentTarget).val() }, function (res) {
        console.log("updatedGamplaytstate: ", res);
    });
}

function createButtons() {
    for (var i = 0; i < groups; i++) {
        var button = $("<input/>").attr("type", "submit").val("Level " + i).data("value", i);
        button.click(function (e) {
         $(".gamevar-slider")
            .val($(e.currentTarget).data("value"))
            .change();
        });
        $(".content-container").append(button);
    }
};