var HalfVizToJSON = require('./HalfVizToJSON'),
    config = require('./config.json'),
    _ = require('underscore'),
    graff = require('graff'),
    conductingUtil = require('./conductingUtil');

exports.conductNextFragment = function (performance) {
    Piece.findOne(performance.piece).done(function(err,piece){
        var jsonGraph = HalfVizToJSON.halfVizToGraff(piece.graph);
        var graffObject = new graff.Graph({"edges": jsonGraph});

        console.log("caught next-fragment-conducted");

        if(!performance.path || !performance.path.length){
            performance.path = conductingUtil.createNewPath(
                performance.currentFragments[1],
                performance.gameplayState,
                jsonGraph,
                graffObject
            );
        }

        performance.currentFragments.splice(0, 1);
        performance.currentFragments[1] = performance.path[0];
        performance.path.splice(0, 1);
    });

}
