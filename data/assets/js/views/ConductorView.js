define([
    'backbone',
    'handlebars',
    'NotesDisplayView',
    'text!../templates/conductor.hbs'
], function (Backbone, Handlebars, NotesDisplayView, conductorTemplate) {
    return  Backbone.View.extend({
        tagName: 'div',
        className: 'conductor',
        template: Handlebars.compile(conductorTemplate),

        events: {
            'click .fragment': 'onFragmentClick'
        },

        initialize: function (options) {
            this.options = options;
        },


        render: function () {
            var templateData = {};
            var html = this.template(templateData);
            this.$el.html(html);
            var self = this;
            if (!this.notesDisplayView) {
                this.notesDisplayView = new NotesDisplayView({
                    performanceId: self.options.performanceId,
                    parent: self
                });
            }
            return this;
        },

        onFragmentClick: function () {
            console.log("about to emit /performance/conductNextFragment");
            socket.get('/performance/conductNextFragment', {performanceId: this.options.performanceId});
        }

    });
});