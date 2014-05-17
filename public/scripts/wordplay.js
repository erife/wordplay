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
	    
	}
    });

var LetterView = Backbone.View.extend({

    tagName: "li", 


    events: {
	"click": "handleClick"
    },
    
    initialize: function(options){
	this.letter = options["letter"];
	this.app = options["app"];
	this.state = "new";
	this.parent = options["parent"];
    },

    render: function(){
	switch(this.state) {
	case "new":     	
	    this.$el.text(this.letter);
	    this.parent.append(this.$el);
	    this.setStatic();
	    break;
	case "removed": 
	    this.$el.remove();
	    break;
	case "static":
	    break;
	}
	return this.state;
    },


    getLetter: function(){
	return this.letter;
    },


    setRemoved: function(){
	this.state = "removed";
    },
    
    setStatic: function(){
	this.state = "static";
    },

    handleClick: function(event){

	    this.app.trigger("letter:position", {position: this.$el.index(), parent_id: this.parent.attr('id')});
    }
});


var LetterContainerView = Backbone.View.extend({

    initialize: function(options){
	this.app = options["app"];
	var el = this.$el;
	this.letters = $.map(options["letters"], function(letter, index){return new LetterView({parent: el,  letter: letter, app: options["app"]});});
	this.listenTo(this.app, 'letter:position', this.handleLetterPosition);
	if(options["type"]){this.listenTo(this.app, 'letter:typed', this.handleTypedLetter)};
	this.listenTo(this.app, 'letter:selected', this.handleLetter);
	this.render();
    },
    
     render: function() {
	var removed = undefined;
	$.each(this.letters, function(index, letter){
	    var state = letter.render();
	    if(state == "removed"){
		removed = index;
	    }
	});
	if(typeof(removed)!="undefined"){this.letters.splice(removed, 1)};
    },

    handleTypedLetter: function(event){
	var letter = event.value;
	var letter_position = $.map(this.letters, function(letterview){return letterview.getLetter()});
	letter_position = letter_position.indexOf(letter);
	if(letter_position > -1){
	    this.app.trigger("letter:position", {position: letter_position, parent_id: this.$el.attr('id')});
	}
    },
    
    handleLetterPosition: function(event){
	if(event.parent_id == this.$el.attr('id')){
	    var removed_letter = this.letters[event.position];
	    if(typeof(removed_letter)!="undefined"){removed_letter.setRemoved()};
	    this.render();
	    this.app.trigger("letter:selected", {letter: removed_letter.letter, parent_id: this.$el.attr('id')});
	}
	
    },

    handleLetter: function(event){
	if(event.parent_id != this.$el.attr('id')){
	this.letters.push(new LetterView({parent: this.$el, letter: event.letter, app: this.app}));
	this.render();
	}
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
	    "keydown":  "handleKeydown",
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
		app.available = new LetterContainerView({letters: letters, app: app, type: true, el:$('#available')});
	    }});
	    app.guess = new LetterContainerView({letters: [], app:app, el:$('#guess')});
	    app.render();
	},


	handleKeydown: function(event) {
	    switch(event.which){
		case 16: this.model.nextLevel();
		break;
		case 8: this.trigger("myevent",{type:"correction"});
		break;
		default: 
		if(event.which >=65 && event.which <=90){
		    var typed_letter = String.fromCharCode(event.which);
		    this.trigger("letter:typed", {value:typed_letter});
		    
		};
		break;
	    }

	}
	

    });
    
    game = new AppView; 
    
});
