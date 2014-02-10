var HalfVizToJSON = require('./HalfVizToJSON'),
    config = require('./config.json'),
    _ = require('underscore'),
    graff = require('graff'),
    conductingUtil = require('./conductingUtil');


exports.setGameplayState = function (data) {
    gameplayState = data.gameplayState;
}
exports.conductNextFragment = function (performance) {
    Piece.findOne(performance.piece).done(function(err,piece){
        var jsonGraph = HalfVizToJSON.halfVizToGraff(piece.graph);
        var graffObject = new graff.Graph({"edges": jsonGraph});

        console.log("caught next-fragment-conducted");

        var newFragmentObject = conductingUtil.getNextFragment(
            performance.currentFragments[1],
            performance.gameplayState,
            performance.path,
            jsonGraph,
            graffObject
        );

        var newFragment = newFragmentObject.fragment;
        performance.path = newFragmentObject.path;

        if (newFragment) {
            performance.currentFragments.splice(0, 1);
            performance.currentFragments[1] = newFragment;
        }

    });

}
