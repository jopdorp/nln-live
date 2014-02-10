define([
    'backbone',
    'PieceCollection'
], function (Backbone,PieceCollection) {
    return  Backbone.View.extend({

        initialize: function (options) {
            _.bindAll(this, 'initializeSockets', 'setInitialScores', 'changeScore', 'debouncedRefreshScores', 'changeScoreImg', 'getFragmentPath');
            this.options = options;
            var self = this;
            this.initializeSockets(function () {
                self.setInitialScores();
            });
            $(window).resize(window.debouncedRefreshScores);
        },

        initializeSockets: function (callback) {
            var self = this;
            window.socket.get('/performance/subscribe', {performanceId: this.options.performanceId}, function (performance) {
                self.performance = performance;
                callback();
            });

            window.socket.on('message', function (message) {
                if (message.model == 'performance' && message.verb == "conduct") {
                    var newFragmentPath = self.getFragmentPath(message.data.piece, message.data.currentFragments[1], message.data.scoreType);
                    $('.fragment',self.options.parent.$el).toggleClass("current-fragment");
                    self.changeScore($('.fragment:not(.current-fragment)',self.options.parent.$el), newFragmentPath, message.data.scoreType);
                }
            });
        },

        setInitialScores: function () {
            var self = this;
            window.socket.get("/performance/" + this.performance.id, {}, function (data) {
                window.scoreType = data.scoreType;
                console.log("currentFragments on initialize", data);
                self.changeScore(
                    $('.fragment:not(.current-fragment)',self.options.parent.$el),
                    self.getFragmentPath(data.piece, data.currentFragments[1], data.scoreType),
                    data.scoreType
                );
                self.changeScore(
                    $('.fragment.current-fragment',self.options.parent.$el),
                    self.getFragmentPath(data.piece, data.currentFragments[0], data.scoreType),
                    data.scoreType
                );
            });
        },


        changeScore: function (element, scorePath, type, redraw) {
            if (element.data("score-path") != scorePath || redraw) {
                element.data("score-path", scorePath);

                if (type === "img") {
                    return this.changeScoreImg(element, scorePath);
                }
            }
        },

        debouncedRefreshScores: _.debounce(function () {
            var self = this;
            _.each($('.fragment',this.options.parent.$el), function (fragment) {
                self.changeScore($(fragment), $(fragment).data("score-path"), this.performance.scoreType, true)
            });
        }, 250),

        changeScoreImg: function (element, newFragmentPath) {
            $(element).css('background-image', 'url(' + newFragmentPath + ')');
        },

        getFragmentPath: function (pieceId, fragment, scoreType) {
            var instrument = 'conductor';
            if(this.options.instrument){
                instrument = this.options.instrument;
            }
            if ($("#instrument-select",this.options.parent.$el).size() > 0 && $("#instrument-select",this.options.parent.$el).val() != null) {
                instrument = $("#instrument-select",this.options.parent.$el).val();
            }
            var piece = PieceCollection.get(pieceId);
            var path = "pieces/" + piece.get('dir') + "/" + instrument + "/" + fragment;
            if (scoreType == "img") {
                path += ".png"
            }
            console.log(path);
            return path;
        }
    });


});


