define(['backbone','MenuView'],
    function (Backbone,MenuView) {
        var Router = Backbone.Router.extend({
            initialize:function(){
                Backbone.history.start();
            },

            views:{
                menu:new MenuView
            },
            routes: {
                '':'menu',
                'page/:page': "page"
            },

            menu: function () {
                this.navigate('page/menu',true);
            },

            page:function(page){
                $('body').html(
                    this.views[page].render().$el.html()
                );
            }
        });
        return Router;
    }
);