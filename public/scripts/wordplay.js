$(function(){

    _.templateSettings = {
	interpolate: /\{\{\=(.+?)\}\}/g,
	evaluate: /\{\{(.+?)\}\}/g
    };
    
    var MessageView = Backbone.View.extend({
    
	el: $("#messaging"),

	messageTemplate: _.template($('#message-template').html()),
	
	states: {
	    pending: {
		message: "welcome to wordplay",
		status: "worried",
		threat: "neutral"
		},
	    running: {
		message: "start typing",
		status: "happy",
		threat: "low"
		}
	},

	initialize: function() {
	    this.state = this.states["pending"];
	    this.render();
	},
	
	render: function() {
	    var context={
		message: this.state["message"], 
		status: this.state["status"], 
		threat: this.state["threat"]
	    }
	    this.$el.html(this.messageTemplate(context));
	},

	setState: function(state) {
	    this.state = this.states[state];
	    this.render();
	}	    
    });
    var AppView = Backbone.View.extend({
	
	el: $(document), 

	events: {
	    "keydown":  "handleKeydown"
	    },

	initialize: function() {
	    this.messaging = new MessageView();
	    this.render();
	},


	handleKeydown: function(event) {
	    switch(event.which){
		case 16: this.start();
		break;
	    }

	},
	
	start: function() {
	    this.messaging.setState("running");
	}

    });
    
    var App = new AppView; 
    
});
