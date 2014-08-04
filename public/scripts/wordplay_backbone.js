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
	    var letterOne = Letters.create({letter: "W"});
	    this.render(letterOne);
	},

	render: function(letterOne){
	    var view = new LetterView({model: letterOne});
	    $('#available').append(view.render().el);
	}

    });

    var App = new AppView();
    
    
});
