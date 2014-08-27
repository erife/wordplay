$(function(){

    var Letter = Backbone.Model.extend({
	
	defaults: function(){
	    return{letter: "A"};
	}

    });


    var LetterList = Backbone.Collection.extend({

	model: Letter, 
	
	localStorage: new Backbone.LocalStorage("storage")
	
    });

    var Letters = new LetterList;

    var LetterView = Backbone.View.extend({

	tagName: "li",
	
	template: _.template("<%= letter %>"),
	
	render: function(){
	    this.$el.html(this.template(this.model.toJSON()));
	    return this;
	}
	
    });

    var Word = Backbone.Model.extend({

	defaults: function(){
	return{word: "noword"};
	}
    });

    var WordList = Backbone.Collection.extend({
	
	model: Word, 
	url: '/wordlist'

	
	
    });

    var Words = new WordList;

    var AppView = Backbone.View.extend({

	el: '#everything', 
	
	initialize: function(){
	    this.letterGenerate("PUPPY");
	    Words.fetch();
	},

	render: function(){
	 },

	letterGenerate: function(letterSet){
	    var app = this;
	    $.each(letterSet.split(""), function(i, letter){
		var letterModel = Letters.create({letter: letter});
		app.addLetter(letterModel);
	    });
	},


	addLetter: function(letterModel){
	    var view = new LetterView({model: letterModel});
	    $('#available').append(view.render().el);
	}



    });

    var App = new AppView();
    
    
});
