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

    var WordView = Backbone.View.extend({
	initialize: function(){
	    this.listenTo(this.model, "change", this.render);
	    this.render();
	    },
	
	render: function() {
	    var i = this.model.get("id");
	    var rendered_word = $("<ul>", {id: "found_word_" + i, class: "letters"});
	    $("#found_column_"+ this.model.get("column")).append(rendered_word);
	    var letters = this.model.getLetters();
	    this.renderLetter(rendered_word, letters);
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



    var FoundModel = Backbone.Model.extend({
	initialize: function(options) {
	    this.set("word", options["word"]);
	    this.set("id", options["id"]);
	    this.set("column", Math.floor(options["id"]/12));
	    this.view = new WordView({model:this});
	},
	
	getLetters: function(){
	    return this.get("word").split('');
	}
    });
    

    var FoundCollection = Backbone.Collection.extend({
	model: FoundModel,
	url: '/wordlist',
	
	getAvailableLetters: function(){
	    var lastword = this.pluck("word").pop().split("");
	    lastword = this.shuffle(lastword);
	    return lastword;
	},
	
	random: function(x) {
	    return Math.floor(x*(Math.random()%1)) 
	},

	shuffle: function(letters){
	    for (J=letters.length-1 ; J>0 ; J--){
		K = this.random(J+1) ; 
		T = letters[J] ; 
		letters[J] = letters[K] ; 
		letters[K] = T; 
	    }
	    return letters;
	}
    });
    
    var FoundView = Backbone.View.extend({

	el: $("#found"),

	initialize: function() {
	    this.render();
	    this.collection.on("fetch", this.render, this);	    
	   	    
	},

	render: function() {
	    var self = this;
	    var column_count = 10;
	    for (var i = 0; i < column_count;  i++){
		var column = $("<li>",{id: "found_column_" + i});
		this.$el.append(column);
	    }
	    var current_column = -1;
	    var row_count = 12;
	  //  console.log(this.collection);
	    
	}
    });

var LetterView = Backbone.View.extend({

    initialize: function(options){
	this.letter = options["letter"];
    },

    render: function(){
    	var letter_display = $("<li>",{id: "letter_position_" + this.id, text:this.letter});
    	this.$el.append(letter_display);
    }
    


});




var AvailableView = Backbone.View.extend({

    el: $("#available"),
    
    initialize: function(options){
	this.letters = $.map(options["letters"], function(letter, index){return new LetterView({el: $("#available"), id: index, letter: letter});});
	this.app = options["app"];
	this.render();
    },
    
    
    render: function() {
	$.each(this.letters, function(index, letter){
	    letter.render();
	});
    },

    handleLetter: function(letter){
	var letter_position = this.letters.indexOf(letter);
	var removed_letter = this.letters.splice(letter_position, 1);
	this.render();
	console.log(removed_letter);
	console.log(this.letters);
//	this.app.trigger("letter:position", {position: letter_position});
//	console.log(letter);
    }
    
    
});				

var GuessView = Backbone.View.extend({

    el: $("#guess"),
    
    initialize: function(options){
	this.letters = options["letters"] || [];
	this.app = options["app"];
	this.render();
    },

    handleLetterPosition: function(event){
	console.log(event);
	console.log("handleLetterPosition");
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
	    var app = this;
	    app.messaging = new MessageView(app.model);
	    app.timer = new TimerView();
	    app.progress = new ProgressView();
	    app.score = new ScoreView();	    
	    app.words = new FoundCollection();
	    app.found = new FoundView({"collection": app.words});
	    app.words.fetch({success: function(collection){
		var letters = collection.getAvailableLetters();
		app.available = new AvailableView({letters: letters, app: app});
	    }});
	    app.guess = new GuessView({app:app});
	    app.render();
	},


	handleKeydown: function(event) {
	    switch(event.which){
		case 16: this.model.nextLevel();
		break;
		case 8: this.model.trigger("myevent",{type:"correction"});
		break;
		default: 
		if(event.which >=65 && event.which <=90){
		    var guessletter = String.fromCharCode(event.which);
		    this.available.handleLetter(guessletter);
		};
		break;
	    }

	}
	

    });
    
    var game = new AppView; 
    
});
