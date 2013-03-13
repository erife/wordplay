console.log("I'm awesome");

$(document).data("maxwordlength", 6);

function initialword(words)
{
    var maxwordlength = $(document).data("maxwordlength");
    return $.grep(words, function(word,i){return word.length == maxwordlength;})[0];
}

function subwords(availableletters, words)
{
    return $.grep(words, function(word,i){
	var myavailable = availableletters.slice();
	var letters = word.split("");
	for(var x = word.length-1; x >= 0; x--){
	    var letter = letters.splice(0,1)[0];
	    var foundpos = myavailable.indexOf(letter);
	    if(foundpos  == -1)
	    {
		return false;
	    }
	    else{
		myavailable.splice(foundpos, 1);
		console.log(myavailable);
	    }
	    
	}
	return true;
    });
}

var words = [
    "qfat",   
    "fatfatfat",
    "faster",
    "father",
    "fat"   
];

var arr = $.makeArray(words);
console.log(arr);

function fillfound(words)
{
    $.map(words, function(word, i){
	var letter_display = "";
	$.map(word.split(""), function(letter){
	    letter_display += "<li>_</li>";
	});
	      var word_display = "<ul>" + letter_display + "</ul>";
	$("#found").append("<li>" + word_display + "</li>");
    });
}

$(function () {
    fillfound(words);
})

