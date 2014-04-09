module.exports = {

    attributes: {
        title : {
            type: 'STRING',
            required: true
        },
        currentFragments: {
            type: 'ARRAY',
            required: true
        },
        piece: {
            type: 'STRING',
            required: true
        },
        scoreType: {
            type: 'STRING',
            required: true
        },
        gameplayState: {
            type: 'INT',
            defaultsTo: 0,
            required: true
        },
        path: {
            type:'ARRAY',
            required:false
        }
    },

    publishConduct: function (performance,socketToOmit) {
        Performance.publish([
            {
                id: performance.id
            }
        ], {
            model: Performance.identity,
            verb: 'conduct',
            data: {
                currentFragments: performance.currentFragments,
                piece: performance.piece,
                scoreType: performance.scoreType
            },
            id: performance.id
        },socketToOmit);
    },

    publishFiredFragmentForInstrument: function(performance,fragment,instrument){
        Performance.publish([
            {
                id: performance.id
            }
        ], {
            model: Performance.identity,
            verb: 'fireFragmentForInstrument',
            data: {
                fragment: fragment,
                piece: performance.piece,
                scoreType: performance.scoreType,
                instrument:instrument
            },
            id: performance.id
        });
    },

    publishPlayedFragmentForInstrument: function(performance,fragment,instrument){
        Performance.publish([
            {
                id: performance.id
            }
        ], {
            model: Performance.identity,
            verb: 'playFragmentForInstrument',
            data: {
                fragment: fragment,
                piece: performance.piece,
                scoreType: performance.scoreType,
                instrument:instrument
            },
            id: performance.id
        });
    }

};
