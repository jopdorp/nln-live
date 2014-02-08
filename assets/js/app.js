require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'vendor/jquery-1.7.1.min',
        underscore: 'vendor/underscore',
        backbone: 'vendor/backbone',
        handlebars: 'vendor/handlebars-v1.3.0',
        handleBarsHelpers: 'HandleBarsHelpers',
        text: 'vendor/text',
        Router: 'Router',
        MenuView: 'views/MenuView',
        PerformanceCollection:'model/PerformanceCollection',
        PerformanceModel:'model/PerformanceModel',
        PieceCollection:'model/PieceCollection',
        PieceModel:'model/PieceModel'
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
        handleBarsHelpers: {
            deps: [
                'handlebars'
            ]
        },
        backbone: {
            exports: 'Backbone',
            deps: [
                'jquery',
                'underscore',
                'handleBarsHelpers'
            ]
        }
    }
});

require([
    'Router'
], function (Router) {
    var socket = io.connect()

    socket.on('connect reconnect', function () {
        socket.on('disconnect', function () {
            window.location.reload(); //TODO implement a more elegant way to reconnect.
        });
    });

    window.socket = socket;

    window.router = new Router();
})();

