define(['backbone','MenuView','ConductorView','InstrumentalistView'],
    function (Backbone,MenuView,ConductorView,InstrumentalistView) {
        var Router = Backbone.Router.extend({
            initialize:function(){
                Backbone.history.start();
            },

            views:{
                menu:new MenuView
            },
            routes: {
                'page/:page': "page",
                'conductor/:side/:performance': "conductor",
                'instrumentalist/:instrument/:performance': "instrumentalist"
            },

            menu: function () {
                this.navigate('page/menu',true);
            },

            conductor:function(side,performance){
                var conductor = new ConductorView({performanceId:performance,side:side})
                $('body').empty();
                $('body').append(
                    conductor.render().$el
                );
            },

            instrumentalist:function(instrument,performance){
                var instrumentalist = new InstrumentalistView({performanceId:performance,instrument:instrument})
                $('body').empty();
                $('body').append(
                    instrumentalist.render().$el
                );
            },

            page:function(page){
                $('body').empty();
                $('body').html(
                    this.views[page].render().$el.html()
                );
            }
        });
        return Router;
    }
);