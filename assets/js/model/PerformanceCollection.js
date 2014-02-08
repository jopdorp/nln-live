define(['backbone','PerformanceModel'],
    function (Backbone,PerformanceModel) {
        var Collection = Backbone.Collection.extend({
            model:PerformanceModel,
            url:'performance'
        });

        var col = new Collection;
        col.fetch({async:false});
        return col;
    }
)