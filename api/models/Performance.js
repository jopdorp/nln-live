module.exports = {

  attributes: {
      id:{
          type:'STRING',
          required:true,
          primaryKey:true
      },
      currentFragments : {
          type:'ARRAY',
          required:true
      },
      piece:{
          type:'STRING',
          required:true
      },
      scoreType:{
          type:'STRING',
          required:true
      },
      gameplayState:{
          type:'INT',
          defaultsTo:0,
          required:true
      }
  }

};
