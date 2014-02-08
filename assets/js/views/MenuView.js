define([
    'backbone',
    'handlebars',
    'text!../templates/menu.hbs',
    'PerformanceCollection',
    'PerformanceModel',
    'PieceCollection'
], function (Backbone, Handlebars, projectListTemplate, PerformanceCollection, PerformanceModel, PieceCollection) {
    var MenuView = Backbone.View.extend({
        el: 'body',
        tagName: "div",
        className: "performanceMenu",

        template: Handlebars.compile(projectListTemplate),
        selectedPerformance: null,

        events: {
            "change select.performance": "onPerformanceSelectChange",
            "change select.piece": "onPieceSelectChange",
            "submit .performance-form": "onSubmitPerformance"
        },

        initialize: function (options) {
            _.bindAll(this, 'render', 'onPerformanceSelectChange', 'onSubmitPerformance', 'initSelectValues');
        },

        render: function () {
            var templateOptions = {
                performances: PerformanceCollection.toJSON(),
                selectedPerformance: this.selectedPerformance ? this.selectedPerformance.toJSON() : '',
                pieces: PieceCollection.toJSON(),
                selectedPiece: this.selectedPerformance ?
                    PieceCollection.get(this.selectedPerformance.get('piece')).toJSON()
                    :
                    ''
            }
            this.$el.html(this.template(templateOptions));
            this.initSelectValues();
            return this;
        },

        initSelectValues: function () {
            if (this.selectedPerformance) {
                $('select.performance').val(this.selectedPerformance.get('id'));
                $('select.piece').val(this.selectedPerformance.get('piece'));
                $('select.scoreType').val(this.selectedPerformance.get('scoreType'));
            }
        },

        onPerformanceSelectChange: function (e) {
            this.selectedPerformance = PerformanceCollection.get($(e.currentTarget).val());
            this.selectedPiece = PieceCollection.get(this.selectedPerformance.get('piece'));
            this.render();
        },

        onPieceSelectChange: function (e) {
            if (this.selectedPerformance) {
                this.selectedPerformance.set('piece', $(e.currentTarget).val());
            }
            this.render();
        },

        onSubmitPerformance: function (e) {
            e.preventDefault();
            var performance = new PerformanceModel($(e.currentTarget).serialize());
            PerformanceCollection.add(performance);
            performance.save();
            this.render();
        }

    });

    return MenuView;
});