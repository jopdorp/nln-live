var walk = require('walk'),
    fs = require('fs'),
    S = require('string');

exports.parseDirectory = function (path) {
    var graph = S(fs.readFileSync(path + "/groupsGraph.viz", 'utf8')).collapseWhitespace().s;
    var instruments = S(fs.readFileSync(path + "/instruments.json", 'utf8')).collapseWhitespace().s;
    instruments = JSON.parse(instruments);
    var metadata = JSON.parse(S(fs.readFileSync(path + "/metadata.json", 'utf8')).collapseWhitespace().s);
    var pieceName = path.split("/");
    pieceName = pieceName[pieceName.length-1];
    Piece.create(
        {
            title:metadata.title,
            instruments: instruments,
            graph: graph,
            metadata: metadata,
            id:pieceName
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
    var filenames = [];
    walk.walkSync(path, {
        followLinks: false,
        listeners: {
            file: function (root, fileStats, next) {
                filenames.push(fileStats.name);
                next();
            }
        }
    });
    var musicalBlocks = [];
    for (var i in filenames) {
        var filename = filenames[i];
        var blockName = filename.substring(0, filename.length-4);
        if(typeof(musicalBlocks[blockName]) == "undefined"){
            musicalBlocks[blockName] = {
                blockName : blockName
            };
        }
        var blockContent = getBlockFileNames(path,filename);
        musicalBlocks[blockName][blockContent.type] = blockContent.value;
    }
    return musicalBlocks;
}

function getBlockFileNames(root,filename) {
    var path= root+"/"+filename;
    if (S(filename).endsWith(".png")) {
        return {type:"imageFile",value:filename};
    }
    if (S(filename).endsWith(".xml")) {
        return {type:"musicXml",value:fs.readFileSync(path, 'utf8')};
    }
    if (S(filename).endsWith(".abc")) {
        return{type:"abc",value:fs.readFileSync(path, 'utf8')};
    }
    return {type:"",value:""};
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