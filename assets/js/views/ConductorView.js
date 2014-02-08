define([
  'jquery',
  'backbone',
  'text!../templates/conductor.html'
], function($, _, Backbone, projectListTemplate){
  var ProjectListView = Backbone.View.extend({
    el: $('#container'),
	events:{
		'click .fragment' : 'onFragmentClick'
	},
    render: function(){
      var data = {};
      var compiledTemplate = _.template( projectListTemplate, data );
      this.$el.append( compiledTemplate );
    },
	onFragmentClick : function() {
		console.log("about to emitnext-fragment-conducted");
    	socket.emit('next-fragment-conducted', {});   
	}
  });

  return ProjectListView;
});