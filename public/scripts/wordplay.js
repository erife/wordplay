$(function(){

    _.templateSettings = {
	interpolate: /\{\{\=(.+?)\}\}/g,
	evaluate: /\{\{(.+?)\}\}/g
    };
    
    var Message = Backbone.Model.extend({

	defaults: function() {
	    return {
		message: "welcome to wordplay",
		status: "worried",
		threat: "neutral"
	    };
	},
	
	initialize: function(app) {
	    this.listenTo(app,"change:state", this.setState);
	},
	
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

	setState: function(event) {
	    var state=this.states[event.changed.state];
	    this.set("message", state["message"]);
	    this.set("status", state["status"]);
	    this.set("threat", state["threat"]);
	}


    });		

    var MessageView = Backbone.View.extend({
    
	el: $("#messaging"),

	messageTemplate: _.template($('#message-template').html()),
	
	

	initialize: function(app) {
	    this.model = new Message(app);	
	    this.listenTo(this.model, "change", this.render);
	    this.render();
	    
	},
	
	render: function() {
	    var context={
		message: this.model.get("message"),
		status: this.model.get("status"),
		threat: this.model.get("threat")
	    }
	    this.$el.html(this.messageTemplate(context));
	}

    });

    var App = Backbone.Model.extend({
	states: [
	    "pending",
	    "running",
	    "finished"
	],
	
	defaults: function(){
	    return{
		state: "pending"
	    }
	},

	nextLevel: function() {
	    switch(this.get("state")){
	    case "pending": this.set("state", "running");
		break;
	    case "running": 
		console.log("check can level");
		console.log("emit level event");
		break;
	    }
	}
    });

    var AppView = Backbone.View.extend({
	
	el: $(document), 

	model: new App(),

	events: {
	    "keydown":  "handleKeydown"
	    },
	

	initialize: function() {
	    this.messaging = new MessageView(this.model);
	    this.render();
	},


	handleKeydown: function(event) {
	    switch(event.which){
		case 16: this.model.nextLevel();
		break;
	    }

	}
	

    });
    
    var App = new AppView; 
    
});
