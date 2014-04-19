var osc = require('node-osc');

module.exports = {

    _config: {},

    subscribe: function (req, res) {
        console.log("request performance/subscribe received", req.param('performanceId'))
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

var oscServer = new osc.Server(3333, '0.0.0.0');
var client = new osc.Client('192.168.1.96', 7778);

oscServer.on("message", function (msg, rinfo) {
    console.log("TUIO message:");
    console.log(msg);
    var body = null;
    if(msg[1]){
        body = JSON.parse(msg[1]);
    }

    if(msg[0] == "/fired"){
        Performance.findOne(body['performanceId']).exec(function (err, performance) {
            Performance.publishFiredFragmentForInstrument(
                performance,body["index"],body["trackName"]
            );
        });
        client.send('/messageReceived', body["messageId"]);
    }
    if(msg[0] == "/played"){
        Performance.findOne(body['performanceId']).exec(function (err, performance) {
            Performance.publishPlayedFragmentForInstrument(
                performance,body["index"],body["trackName"]
            );
        });
        client.send('/messageReceived', body["messageId"]);
    }

    if(msg[0] == "/getPerformances"){
        console.log("about to find performances");
        Performance.find({}).done(function (err, performances) {
            console.log(performances);
            client.send('/performances', JSON.stringify(performances));
        });
    }

    if(msg[0] == "/getInstruments"){
        console.log("about to find performance for instruments");
        MusicalBlock.find({pieceId:body['pieceId']}).done(function (err, musicalBlocks) {
            var instruments = {};
            for(var i in musicalBlocks){
                var instrument = musicalBlocks[i].instrument;
                if(instruments[instrument]){
                    instruments[instrument]++;
                }else{
                    instruments[instrument] = 1;
                }
            }
            console.log(instruments);
            client.send('/instruments', JSON.stringify(instruments));
        });


    }
});