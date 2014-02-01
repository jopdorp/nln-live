var walk = require('walk'),
    fs = require('fs'),
    S = require('string');

exports.parseDirectory = function (path) {
    var graph = S(fs.readFileSync(path + "/groupsGraph.viz", 'utf8')).collapseWhitespace().s;
    var instruments = JSON.parse(S(fs.readFileSync(path + "/instruments.json", 'utf8')).collapseWhitespace().s);
    var metadata = JSON.parse(S(fs.readFileSync(path + "/metadata.json", 'utf8')).collapseWhitespace().s);
    Piece.create(
        {
            title:metadata.title,
            instruments: instruments,
            graph: graph,
            metadata: metadata
        }
    ).done(function(err,piece){
            return onPieceCreated(err,piece,path);
        }
    );
};

function walkInstruments(path) {
    var paths = [];
    walk.walkSync(path, {
        followLinks: false,
        listeners: {
            directories: function (root, dirStatsArray, next) {
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
    walk.walkSync(path, {
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
        musicalBlocks.push(
            getBlockPaths(paths, i, musicalBlocks)
        );
    }
    return musicalBlocks;
}

function getBlockPaths(path) {
    var block = {};
    if (S(path).endsWith(".png")) {
        block.imagePath = path;
    }
    if (S(path).endsWith(".xml")) {
        block.musicXml = fs.readFileSync(path, 'utf8');
    }
    if (S(path).endsWith(".abc")) {
        block.abc = fs.readFileSync(path, 'utf8');
    }
    return block;
}

function onPieceCreated (err, piece,path) {
    if (err) {
        return console.log(err, piece);
    } else {
        var instruments = walkInstruments(path);
        for(var instrumentName in instruments ) {
            createMusicalBlock(instruments, instrumentName, piece);
        }
        return console.log("succesfully created piece", piece);
    }
}

function createMusicalBlock(instruments, instrumentName, piece) {
    var instrument = instruments[instrumentName];
    for (var i in instrument) {
        var musicalBlock = instrument[i];
        musicalBlock.instrument = instrumentName;
        musicalBlock.pieceId = piece.id;

        MusicalBlock.create(musicalBlock).done(function (err2, block) {
            if (err2) {
                return console.log(err2, block);
            } else {
                console.log("succesfully created musicalBlock", block);
            }
        });
    }
    return musicalBlock;
}