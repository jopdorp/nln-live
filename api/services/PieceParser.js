var walk = require('walk'),
    fs = require('fs'),
    S = require('string');

exports.parseDirectory = function (path) {
    var graph = S(fs.readFileSync(path + "/groupsGraph.viz", 'utf8')).collapseWhitespace().s;
    var instruments = JSON.parse(S(fs.readFileSync(path + "/instruments.json", 'utf8')).collapseWhitespace().s);
    var metadata = JSON.parse(S(fs.readFileSync(path + "/metadata.json", 'utf8')).collapseWhitespace().s);
    Piece.create(
        {
            instruments: instruments,
            graph: graph,
            metadata: metadata
        }
    ).done(function (err, piece) {
            if (err) {
                return console.log(err, piece);
            } else {
                var instruments = walkInstruments(path);
                for(var instrumentName in instruments ){
                    var instrument = instruments[instrumentName];
                    for(var i in instrument){
                        var musicalBlock = instrument[i];
                        musicalBlock.instrument = instrumentName;
                        musicalBlock.pieceId = piece.id;

                        MusicalBlock.create(musicalBlock).done(function(err2,block){
                                if (err2) {
                                    return console.log(err2, block);
                                } else {
                                    console.log("succesfully created musicalBlock",block);
                                }
                        });
                    }
                }
                return console.log("succesfully created piece", piece);
            }
        }
    );
};

function walkInstruments(path) {
    var paths = [];
    var walker = walk.walkSync(path, {
        followLinks: false,
        listeners: {
            directories: function (root, dirStatsArray, next) {
                // dirStatsArray is an array of `stat` objects with the additional attributes
                // * type
                // * error
                // * name
                dirStatsArray.forEach(
                    function(dir) {
                        paths.push({path:root + "/" + dir.name,name:dir.name});
                    }
                )
                next();
            }
        }
    });

    var instruments = [];
    for (var i in paths) {
        instruments[paths[i].name] = walkInstrumentDir(paths[i].path);
    }
    return instruments;
}

function walkInstrumentDir(path) {
    var paths = [];
    var walker = walk.walkSync(path, {
        followLinks: false,
        listeners: {
            file: function (root, fileStats, next) {
                paths.push(root + "/" + fileStats.name);
                next();
            }
        }
    });
    var musicalBlocks = [];
    for (var i in paths) {
        var block = {};
        if (S(paths[i]).endsWith(".png")) {
            block.imagePath = paths[i];
        }
        if (S(paths[i]).endsWith(".xml")) {
            block.musicXml = fs.readFileSync(paths[i], 'utf8');
        }
        if (S(paths[i]).endsWith(".abc")) {
            block.abc = fs.readFileSync(paths[i], 'utf8');
        }
         musicalBlocks.push(block);
    }
    return musicalBlocks;
}