module.exports = {

    _config: {},

    subscribe: function (req, res) {
        console.log("request performance/subscrive received", req.param('performanceId'))
        Performance.findOne(req.param('performanceId')).exec(function (err, performance) {
            Performance.subscribe(req.socket, performance);
            res.send(performance);
        });
    },

    conductNextFragment: function (req, res) {
        console.log("request conduct/nextFragment received")

        Performance.findOne(req.param('performanceId')).done(function (err, performance) {
            RealtimeApi.conductNextFragment(performance);
            performance.save(function () {
                Performance.publishConduct(performance);
            });
            res.json(performance);
        });
    }
};
