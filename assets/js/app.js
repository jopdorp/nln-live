require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'vendor/jquery-1.7.1.min',
        underscore: 'vendor/underscore',
        backbone: 'vendor/backbone',
        handlebars: 'vendor/handlebars-v1.3.0',
        text: 'vendor/text',


        Router: 'Router',


        MenuView: 'views/MenuView',

        PerformanceCollection: 'model/PerformanceCollection',
        PerformanceModel: 'model/PerformanceModel',
        PieceCollection: 'model/PieceCollection',
        PieceModel: 'model/PieceModel',

        ConductorView: 'views/ConductorView',
        InstrumentalistView: 'views/InstrumentalistView',
        NotesDisplayView: 'views/NotesDisplayView',
        InterpreterView: 'views/InterpreterView'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        handlebars: {
            exports: 'Handlebars',
            deps: [
                'text'
            ]
        },
        backbone: {
            exports: 'Backbone',
            deps: [
                'jquery',
                'underscore',
                'handlebars'
            ]
        }
    }
});

require([
    'Router'
], function (Router) {
    var socket = io.connect()
    window.socket = socket;

    socket.on('connect', function () {
        if(!window.router){
            window.router = new Router();
        }

        socket.on('disconnect', function () {
            window.location.reload(); //TODO implement a more elegant way to reconnect.
        });
    });


})();

