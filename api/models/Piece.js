/**
 * Piece
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        id: {
            type: 'STRING',
            required: true,
            primaryKey: true
        },
        title:{
            type:'STRING',
            required:true
        },
        instruments:{
            type: 'JSON',
            required: true
        },
        graph: {
            type: 'STRING',
            required: true
        },
        metadata: {
            type:'JSON',
            required: false
        }
    }

};
