/**
 * MusicalBlock
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
      pieceId:{
          type:'STRING',
          required:true
      },
      instrument:{
          type:'STRING',
          required:true
      },
      abc:{
          type:'STRING',
          required:false
      },
      imagePath:{
          type:'STRING',
          required:false
      },
      musicXml:{
          type:'STRING',
          required:false
      }
  }

};
