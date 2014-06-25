define(['backbone','PieceModel'],
    function (Backbone,PieceModel) {
        var Collection = Backbone.Collection.extend({
            model:PieceModel,
            url:'piece'
        });
        var col = new Collection;
        col.fetch({async:false});
        return col;
    }
);