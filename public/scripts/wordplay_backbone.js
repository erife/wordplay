$(function(){

    var Letter = Backbone.Model.extend({
	
	defaults: function(){
	    return{letter: "A", location: "available"};
	},

	toggle: function(){
	    this.save({location: (this.get('location')=='available' ? 'guess' : 'available')});
	}
  });


    var LetterList = Backbone.Collection.extend({

	model: Letter, 
	
	localStorage: new Backbone.LocalStorage("storage"),
	
	
	availableLetters: function(){
	    return this.where({location: "available"});
	},

	guessLetters: function(){
	    return this.where({location: "guess"});
	},
	
	removeLetter: function(model){
	    this.remove(model);
	},
	
	addLetter: function(model){
	    this.push(model);
	}
	

	
    });

    var Letters = new LetterList;
    var GuessedLetters = new LetterList;

    var LetterView = Backbone.View.extend({

	tagName: "li",
	
	template: _.template("<%= letter %>"),
	
	events: {
	    "click" : "toggleGuessed"
	},

	initialize:function(){
	    this.listenTo(this.model, 'destroy', this.remove);
	    this.listenTo(this.model, 'change', this.render);
	},

	render: function(){
	    this.$el.html(this.template(this.model.toJSON()));
	    return this;
	},

	toggleGuessed: function(){
	    if(this.model.get('location') == 'available'){
		Letters.removeLetter(this.model);
		GuessedLetters.addLetter(this.model);
		this.model.toggle();
	    }
	    else{
		console.log('not available');
		
		//	GuessedLetters.moveLetter(this.model);
	    }

	}
	
    });

    var Word = Backbone.Model.extend({

	defaults: function(){
	return{word: "noword"};
	}
    });

    var WordList = Backbone.Collection.extend({
	
	model: Word, 
	url: '/wordlist',

	letterSet: function(index){
	    return this
		.at(this.length-1)
		.get('word')
		.split("");
	    
	}


    });
    
    var WordView = Backbone.View.extend({
	
	tagName: "li",
	
	initialize:function(){
	    this.listenTo(this.model, 'remove', this.remove);
	    this.listenTo(this.model, 'change', this.render);
	},
	
	render: function(){
	    var word = this.model.get('word');
	    var container = $("<ul>", {class: "letters"});
	    $.map(word.split(""), function(x){
		container.append($("<li>", {html: x}))})
	    this.$el.append(container);
	    return this;
	}

    });

    var Words = new WordList;

    var AppView = Backbone.View.extend({

	el: '#everything', 

	events: {
	    "click .shuffle" : "handleShuffle",
	    "click #start" : "startGame"
	},
	
	initialize: function(){
	    this.listenTo(Letters, 'change', this.collectionChange);
	    this.listenTo(GuessedLetters, 'change', this.collectionChange);
	    $("#start").html("Start");
	},

	render: function(){
	    $("#found").empty();
	    Words.each(function(word, i){
		var wordview = new WordView({model: word});
		var column_id = "column"+Math.floor(i/10);
		if(i%10 == 0){
		    var column_li = $("<li>");
		    column_ul = column_li.append($("<ul>", {id: column_id}));
		    $('#found').append(column_li);
		}
		$("#"+column_id).append(wordview.render().el);
		
	    });
	    
	},

	wordInitalize: function(){
	    App.letterGenerate(Words.letterSet());
	    App.render();
	},

	letterGenerate: function(letterSet){
	    $.each(letterSet, function(i, letter){
		Letters.create({letter: letter});
	    });
	    this.handleShuffle();
	},

	addAvailableLetter: function(letterModel){
	    var view = new LetterView({model: letterModel});
	    $('#available').append(view.render().el);
	},

	addGuessLetter: function(letterModel){
	    var view = new LetterView({model: letterModel});
	    $('#guess').append(view.render().el);
	},
	
	addCollection: function(){
	    var app = this;
	    $.map(Letters.availableLetters(), function(i){
		app.addAvailableLetter(i);
	    });
	    $.map(GuessedLetters.guessLetters(), function(i){
		app.addGuessLetter(i);
	    });
	},

	collectionChange: function(){
	    $('#available').empty();
	    $('#guess').empty();
	    this.addCollection();	    
	},

	handleShuffle: function(){
	    var LetterCopy = Letters.shuffle();
	    _.invoke(Letters.toArray(), "destroy");
	    Letters.reset(LetterCopy);
	    this.collectionChange();
	},

	startGame: function(){
	    _.invoke(Letters.toArray(), "destroy");
	    Words.remove(Words.toArray());
	    Words.fetch({success: this.wordInitalize});
	}
	
    });
    
    var App = new AppView();
    
    
});
