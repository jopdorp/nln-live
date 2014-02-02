var HalfVizToJSON = require('./HalfVizToJSON'),
    fs = require('fs'),
    config = require('./config.json'),
    _ = require('underscore'),
    graff = require('graff'),
    conductingUtil = require('./conductingUtil');
var gameplayState = 0;
var fragments = [
    "0.0",
    "1.2"
];

exports.fragments = fragments;
var graphPath = __dirname + "/../../assets/pieces/" + config.piece + "/" + "groupsGraph.viz";

fs.readFile(graphPath, 'utf8', function (err, data) {
    if (err) throw err;
    setTimeout(function () {
        createSocket(
            HalfVizToJSON.halfVizToGraff(data)
        );
    }, 8000);
});


function createSocket(groups) {
    var jsonGraph = groups;
    var graffObject = new graff.Graph({"edges": groups});
    var currentPath = [];

    console.log("graffObject is ", graffObject)

    exports.setGameplayState = function (data) {
        gameplayState = data.gameplayState;
    }
    exports.conductNextFragment = function (performance) {
        console.log("caught next-fragment-conducted");

        var newFragmentObject = conductingUtil.getNextFragment(
            performance.currentFragments[1],
            performance.gameplayState,
            currentPath,
            jsonGraph,
            graffObject
        );

        var newFragment = newFragmentObject.fragment;
        currentPath = newFragmentObject.path;

        if (newFragment) {
            performance.currentFragments.splice(0, 1);
            performance.currentFragments[1] = newFragment;
        }
    }
}
