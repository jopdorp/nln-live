module.exports = {

    attributes: {
        id: {
            type: 'STRING',
            required: true,
            primaryKey: true
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
        path: 'ARRAY'
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
    }

};
