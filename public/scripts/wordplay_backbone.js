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
	
	initialize: function(){
	},

	render: function(){
	    this.$el.html(this.template(this.model.toJSON()));
	    return this;
	}
	
    });

    var AppView = Backbone.View.extend({

	el: '#everything', 
	
	initialize: function(){
	    var letterSet = ["E", "L", "A", "I", "N", "A"];
	    var app = this;
	    $.each(letterSet, function(i, letter){
		var letterModel = Letters.create({letter: letter});
		app.addLetter(letterModel);
	    });
	},

	render: function(){
	 },

	addLetter: function(letterModel){
	    var view = new LetterView({model: letterModel});
	    $('#available').append(view.render().el);
	}



    });

    var App = new AppView();
    
    
});
