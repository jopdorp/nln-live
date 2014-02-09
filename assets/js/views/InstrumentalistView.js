define([
    'backbone',
    'handlebars',
    'NotesDisplayView',
    'text!../templates/instrumentalist.hbs',
    'PerformanceCollection',
    'PieceCollection'
], function (Backbone, Handlebars, NotesDisplayView, instrumentalistTemplate, PerformanceCollection, PieceCollection) {
    return  Backbone.View.extend({
        tagName: 'div',
        className: 'instrumentalist',
        template: Handlebars.compile(instrumentalistTemplate),

        events: {
            'change #instrument-select': 'onInstrumentSelectChange'
        },

        initialize: function (options) {
            _.bindAll(this, 'render', 'onInstrumentSelectChange');
            this.options = options;
            this.performance = PerformanceCollection.get(this.options.performanceId)
        },


        render: function () {
            var templateData = {};
            var html = this.template(templateData);
            this.$el.html(html);
            this.initializeInstrumentSelect()
            if (!this.notesDisplayView) {
                this.notesDisplayView = new NotesDisplayView({
                    performanceId: this.options.performanceId,
                    parent: this,
                    instrument: this.options.instrument
                });
            }
            $("html, body").animate({ scrollTop: $(document).height() });

            return this;
        },

        onInstrumentSelectChange: function (e) {
            this.notesDisplayView = new NotesDisplayView({
                performanceId: self.options.performanceId,
                parent: this,
                instrument: $(e.currentTarget).val()
            });
        },

        initializeInstrumentSelect: function () {
            var piece = PieceCollection.get(this.performance.get('piece'));

            var select = $('#instrument-select', this.$el);

            var options = "";
            if (select.prop) {
                options = select.prop('options');
            } else {
                options = select.attr('options');
            }

            $('option', select).remove();

            $.each(piece.get('instruments'), function (val, text) {
                options[options.length] = new Option(text, val);
            });
            $("#instrument-select", this.$el).val(this.options.instrument);
        }

    });
});