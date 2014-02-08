define([
  'backbone',
  'handlebars',
  'NotesDisplayView',
  'text!../templates/conductor.hbs'
], function(Backbone,Handlebars, NotesDisplayView,conductorTemplate){
  return  Backbone.View.extend({
    tagName:'div',
    template:Handlebars.compile(conductorTemplate),

	events:{
		'click .fragment' : 'onFragmentClick'
	},

    render: function(){
      var templateData = {};
      var html = this.template(templateData);
      this.$el.html(html);
    },

	onFragmentClick : function() {
		console.log("about to emitnext-fragment-conducted");
    	socket.emit('next-fragment-conducted', {});   
	}

  });
});