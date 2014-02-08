/**
 * PieceController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to PieceController)
     */
    _config: {},

    subscribe: function (req, res) {
        console.log("request piece/subscrive received", req.param('pieceId'))
        Piece.findOne(req.param('pieceId')).exec(function (err, piece) {
            Piece.subscribe(req.socket, piece);
            res.send(piece);
        });
    },

    parsedir: function (req, res) {
        res.json(
            PieceParser.parseDirectory(req.param('path'))
        );
    },

    titles: function (req, res) {
        Piece.find().exec(function(err, pieces) {
            var titles = [];
            for (var i in pieces) {
                titles.push({title: pieces[i].title, id: pieces[i].id})
            }
            res.json(titles);
        });
    }

};
