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
    setTimeout(function(){
        createSocket(
            HalfVizToJSON.halfVizToGraff(data)
        );
    },8000);
});


function createSocket(groups) {
    var jsonGraph = groups;
    var graffObject = new graff.Graph({"edges": groups});
    var currentPath = [];

    console.log("graffObject is ", graffObject)

    module.exports['set-gameplay-state'] = function (data) {
        gameplayState = data.gameplayState;
    };

    module.exports['next-fragment-conducted'] =  function (req,res) {
        console.log("caught next-fragment-conducted");

        var newFragmentObject = conductingUtil.getNextFragment(
            fragments[1],
            gameplayState,
            currentPath,
            jsonGraph,
            graffObject
        );

        var newFragment = newFragmentObject.fragment;
        currentPath = newFragmentObject.path;

        if (newFragment) {
            fragments.splice(0, 1);
            fragments[1] = newFragment;
        }

        console.log("about to emit play-next-fragment", {piece: config.piece, fragments: fragments, scoreType: config.scoreType});
        req.socket.broadcast.emit('play-next-fragment', {piece: config.piece, fragments: fragments, scoreType: config.scoreType});
        req.socket.emit('play-next-fragment', {piece: config.piece, fragments: fragments, scoreType: config.scoreType});
    };
}
