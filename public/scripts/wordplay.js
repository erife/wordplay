$(function(){

    _.templateSettings = {
	interpolate: /\{\{\=(.+?)\}\}/g,
	evaluate: /\{\{(.+?)\}\}/g
    };
    
    var TimerView = Backbone.View.extend({

	el: $("#time"),
	
	timerTemplate: _.template($('#timer-template').html()),

	initialize: function() {
	    this.render();
	},

	render: function() {
	    var time = "5:00";
	    this.$el.html(this.timerTemplate({timer: time}));
	}


    });

    var ProgressView = Backbone.View.extend({

	el: $("#progress"),
	
	progressTemplate: _.template($('#progress-template').html()),

	initialize: function() {
	    this.render();
	},

	render: function() {
	    var context = {
		found_word_count: 7,
		total_word_count: 30
	    }
	    
	    this.$el.html(this.progressTemplate(context));
	}


    });

    var FoundModel = Backbone.Model.extend({

    });
    

    var FoundCollection = Backbone.Collection.extend({
	model: FoundModel,
	url: '/data'
    });
    
    var FoundView = Backbone.View.extend({

	el: $("#found"),
	model: FoundModel,	

	initialize: function() {
	    var wordlist = new FoundCollection();
	    wordlist.fetch;
	    console.log(wordlist);
	    this.render();
	},

	render: function() {
	    var self = this;
	    
//	    var wordlist = 
//		["pea", "see", "far", "fan", "fast", "spar", "hang", "slam",  "stand", 
//		 "fling", "change", "flange", "finger"];
	    var column_count = 10;
	    for (var i = 0; i < column_count;  i++){
		var column = $("<li>",{id: "found_column_" + i});
		this.$el.append(column);
	    }
	    var current_column = -1;
	    var row_count = 12;
	    $(this.wordlist).each(function(i, word){
		if(i % row_count == 0) {current_column++};
		var rendered_word = $("<ul>", {id: "found_word_" + i, class: "letters"});
		$("#found_column_"+ current_column).append(rendered_word);
		var letters = word.split('');
		self.renderLetter(rendered_word, letters);
	    });
	    
	},
	
	renderLetter: function(rendered_word, letters){
	    var self = this;
	    if(letters.length <= 0) {
		return;
	    }
	    var letter = letters.shift();
	    var rendered_letter = $("<li>").append(letter);
	    rendered_letter.hide();
	    rendered_word.append(rendered_letter);
	    rendered_letter.fadeIn(300, "linear", function(){self.renderLetter(rendered_word, letters)});
	    
	}
    });


var BucketView = Backbone.View.extend({


    initialize: function(options){
	this.letters = options["letters"] || [];
	this.render();
    },

    

    render: function() {
    	for (var i = 0; i < this.letters.length;  i++){
    	    var letter = $("<li>",{id: "letter_position_" + i, text:this.letters[i]});
    	    this.$el.append(letter);
    	};
    }
});				




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
	    this.listenTo(app, "myevent", this.handleBackspace);
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
	},

	handleBackspace: function(event) {
	    this.set("message", "oops");
	    this.set("status", "angry");
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

    var ScoreView = Backbone.View.extend({

	el: $("#score"),
	
	scoreTemplate: _.template($('#score-template').html()),

	initialize: function() {
	    this.render();
	},

	render: function() {
	    var score = "5000";
	    this.$el.html(this.scoreTemplate({score: score}));
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
	    this.timer = new TimerView();
	    this.progress = new ProgressView();
	    this.score = new ScoreView();	    
	    this.found = new FoundView();	  
	    this.available = new BucketView({el: $("#available"), letters: ["a","s","e","f","g","h"]});
	    this.guess = new BucketView({el: $("#guess")});
	    this.render();
	},


	handleKeydown: function(event) {
	    switch(event.which){
		case 16: this.model.nextLevel();
		break;
		case 8: this.model.trigger("myevent",{type:"correction"});
		break;
		default: console.log(event.which);
		break;
	    }

	}
	

    });
    
    var App = new AppView; 
    
});
