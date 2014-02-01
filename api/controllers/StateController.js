var config = require('../services/config.json');
module.exports = {

    current: function (req, res) {
        console.log(config);
        res.json({fragments:RealtimeApi.fragments,scoreType:config.scoreType,piece:config.piece});
    }

};
