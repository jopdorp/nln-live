var _ = require('underscore');

exports.createNewPath = function (currentFragment, wishedGroup, jsonGraph, graffObject) {
    var fragmentsInWishedGroup = getFragmentsInWishedGroup(jsonGraph, wishedGroup);

    var path = [];
    var currentFragmentIndex = fragmentsInWishedGroup.indexOf(currentFragment);

    if (currentFragmentIndex != -1 && fragmentsInWishedGroup > 1) {
        fragmentsInWishedGroup.splice(currentFragmentIndex, 1);
    }

    if (!fragmentsInWishedGroup || fragmentsInWishedGroup.length == 0) {
        path = currentFragment;
    } else {
        path = graffObject.get_path(currentFragment, fragmentsInWishedGroup);
        console.log("Path from current fragment " + currentFragment + "  To next fragment in wished group", path);

        if(path == null) {
            console.log("No path found so selecting random block from destination group");
            path = [fragmentsInWishedGroup[Math.floor(Math.random()*fragmentsInWishedGroup.length)]];
        } else {
            path.splice(0, 1);
        }
    }

    return path;
}

function getFragmentsInWishedGroup(jsonGraph, wishedGroup) {
    var fragmentsInWishedGroup = [];
    for (var i in jsonGraph) {
        for (var j = 0; j < 1; j++) {
            var nodeGroup = jsonGraph[i][j].split(".")[0];
            if (nodeGroup == wishedGroup && !_.contains(fragmentsInWishedGroup, jsonGraph[i][0])) {
                fragmentsInWishedGroup.push(jsonGraph[i][j]);
            }
        }
    }
    console.log("fragmentsInWishedGroup " + wishedGroup + " is:", fragmentsInWishedGroup);
    return fragmentsInWishedGroup;
}
