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
	url: '/wordlist',

	letterSet: function(){
	    return this.where({id: this.length-1});
	}


    });
    
    var WordView = Backbone.View.extend({
	
	tagName: "li",
	
	template: _.template("<%= word %>"),	

	render: function(){
	    this.$el.html(this.template(this.model.toJSON()));
	    return this;
	}

    });

    var Words = new WordList;

    var AppView = Backbone.View.extend({

	el: '#everything', 
	
	initialize: function(){
	    Words.fetch({success: this.wordInitalize});
	},

	render: function(){
	    console.log("render");
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
	    var seedWord = Words.letterSet()[0].get('word');
	    App.letterGenerate(seedWord);
	    App.render();
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
