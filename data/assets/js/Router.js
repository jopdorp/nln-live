define(['backbone','MenuView','ConductorView','InstrumentalistView','InterpreterView'],
    function (Backbone,MenuView,ConductorView,InstrumentalistView,InterpreterView) {
        var Router = Backbone.Router.extend({
            initialize:function(){
                Backbone.history.start();
            },

            views:{
                menu:new MenuView
            },
            routes: {
                '':"menu",
                'page/:page': "page",
                'conductor/:side/:performance': "conductor",
                'instrumentalist/:instrument/:performance': "instrumentalist",
                'interpreter/:performance': "interpreter"
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

            interpreter:function(performance){
                var interpreter = new InterpreterView({performanceId:performance})
                $('body').empty();
                $('body').append(
                    interpreter.render().$el
                );
            },

            page:function(page){
                $('body').empty();
                $('body').html(
                    this.views[page].render().$el.html()
                );
            },

            menu:function(){
                this.page("menu");
            }
        });
        return Router;
    }
);