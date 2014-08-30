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

        nextFragmentDelayed : false,


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

        onFragmentClick: function(){
            if(!this.nextFragmentDelayed){
                console.log("about to emit /performance/conductNextFragment");
                socket.get('/performance/conductNextFragment', {performanceId: this.options.performanceId});
                this.nextFragmentDelayed = true;
                var self = this;
                setTimeout(function(){
                    self.nextFragmentDelayed = false;
                },1000)
            }
        }
    });
});