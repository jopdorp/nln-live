define(['backbone', 'handlebars', 'text!./../templates/interpreter.hbs', 'PieceCollection', 'PerformanceCollection'
], function (Backbone, Handlebars, interpreterTemplate, PieceCollection, PerformanceCollection) {
    return Backbone.View.extend({
        tagName: 'div',
        className: 'interpreter',
        template: Handlebars.compile(interpreterTemplate),

        events: {
            'change .gamevar-slider': 'onSliderChange',
            'click  .gamevar-button': 'onButtonClick'
        },
        initialize: function (options) {
            this.options = options;
            _.bindAll(this, 'render', 'onSliderChange')
            var performance = PerformanceCollection.get(options.performanceId);
            var piece = PieceCollection.get(performance.get('piece'));
            this.groups = piece.get('groups');
            socket.on('message', function (message) {
                if (message.model == 'performance') {
                    $(".gamevar-slider").val(message.data.gameplayState);
                }
            });
        },

        render: function () {
            var count = 0;
            for(var i in this.groups) {
                count++;
            }
            count--;
            this.$el.html(
                this.template({groups: this.groups,groupsCount:count})
            );
            return this;
        },

        onSliderChange: function (event) {
            console.log("about to emit setgameplaystate: " + $(event.currentTarget).val());
            socket.put('/performance/' + this.options.performanceId, { gameplayState: $(event.currentTarget).val() }, function (res) {
                console.log("updatedGamplaytstate: ", res);
            });
        },
        onButtonClick: function(event){
            $('.gamevar-slider').val($(event.currentTarget).data("value"));
            $('.gamevar-slider').change();
        }
    });
});
