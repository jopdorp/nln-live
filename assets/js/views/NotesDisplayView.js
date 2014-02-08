define([
    'backbone',
    'handlebars',
    'text!../templates/notesDisplay.hbs'
], function (Backbone, Handlebars, NotesDisplay) {
    return  Backbone.View.extend({

        initialize: function (options) {
            this.options = options;
            this.initializeSockets();
            this.preloadImages();
            this.setInitialScores();
            $(window).resize(window.debouncedRefreshScores);
        },

        initializeSockets: function () {
            socket.get('performance/subscribe', {performanceId: this.options.performance.id});

            socket.on('message', function (message) {
                if (message.model == 'performance' && message.verb == "conduct") {
                    var newFragmentPath = getFragmentPath(message.data.piece, message.data.currentFragments[1], message.data.scoreType);
                    $('.fragment').toggleClass("current-fragment");
                    changeScore($('.fragment:not(.current-fragment)'), newFragmentPath, message.data.scoreType);
                }
            });
        },

        setInitialScores: function () {
            socket.get("/performance/" + this.options.performance.id, {}, function (data) {
                window.scoreType = data.scoreType;
                console.log("currentFragments on initialize", data);
                changeScore(
                    $('.fragment:not(.current-fragment)'),
                    getFragmentPath(data.piece, data.currentFragments[1], data.scoreType)
                    , data.scoreType);
                changeScore(
                    $('.fragment.current-fragment')
                    , getFragmentPath(data.piece, data.currentFragments[0], data.scoreType)
                    , data.scoreType);
            });
        },


        changeScore: function (element, scorePath, type, redraw) {
            if (element.data("score-path") != scorePath || redraw) {
                element.data("score-path", scorePath);

                if (type === "xml") {
                    return changeScoreXml(element, scorePath);
                } else if (type === "img") {
                    return changeScoreImg(element, scorePath);
                }
            }
        },

        debouncedRefreshScores: _.debounce(function () {
            _.each($('.fragment'), function (fragment) {
                changeScore($(fragment), $(fragment).data("score-path"), this.options.performance.scoreType, true)
            });
        }, 250),

        changeScoreXml: function (element, scoreXmlPath) {
            $.get(scoreXmlPath, function (data) {
                console.log(data);
                var doc = new Vex.Flow.MusicXML.Document(data);
                var VexFlow_Viewer = new Vex.Flow.MusicXML.Viewer($(element)[0], doc);
                $(element).prepend('<div class="vertical-aligner"></div>');
                return VexFlow_Viewer;
            });
        },

        changeScoreImg: function (element, newFragmentPath) {
            $(element).css('background-image', 'url(' + newFragmentPath + ')');
        },

        getFragmentPath: function (piece, fragment, scoreType) {
            var instrument = "conductor";
            if ($("#instrument-select").size() > 0) {
                instrument = $("#instrument-select").val();
            }
            var path = "pieces/" + piece + "/" + instrument + "/" + fragment;
            if (scoreType == "img") {
                path += ".png"
            }
            console.log(path);
            return path;
        }
    });


});


