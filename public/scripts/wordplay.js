
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
	var word_id = "word_" + i;
	$("#found").append("<li> <ul id='" + word_id + "'> </ul> </li>");
	fillsingle(word, i);
    });
}

function fillsingle(word, index, blank=true)
{
	var letter_display = "";
	$.map(word.split(""), function(letter){
	    var filler= (blank) ? "_" : letter;
	    letter_display += "<li>" + filler + "</li>";
	});
    var word_display = letter_display;
    $("#word_" + index).html(word_display);
}




$(function () {
    var availableletters = 'faster'.split("");
    var resultwords = subwords(availableletters, words);
    fillfound(resultwords);
})

