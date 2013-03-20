
$(document).data("maxwordlength", 6);

function initialword(words)
{
    var maxwordlength = $(document).data("maxwordlength");
    return $.grep(words, function(word,i){return word.length == maxwordlength;})[0];
}

function subwords(availableletters, words)
{
    return $.grep(words, function(word){
	var myavailable = availableletters.slice();
	var letters = word.split("");
	for(var x = word.length-1; x >= 0; x--){
	    var letter = letters.pop();
	    var foundpos = myavailable.indexOf(letter);
	    if(foundpos  == -1)
	    {
		return false;
	    }
	    else{
		myavailable.splice(foundpos, 1);
	    }
	    
	}
	return true;
    });
}


// var words = [
//     "after",
//     "are",
//     "art",
//     "arts",
//     "ate",
//     "ear",
//     "ears",
//     "east",
//     "eat",
//     "eats",
//     "far",
//     "fare",
//     "fares",
//     "farts",
//     "fast",
//     "faster",
//     "fat",
//     "fate",
//     "fates",
//     "fear",
//     "fears",
//     "feast",
//     "feat",
//     "fret",
//     "par",
//     "pare",
//     "pares",
//     "parse",
//     "part",
//     "parts",
//     "past",
//     "paste",
//     "pat",
//     "pats",
//     "pea",
//     "pear",
//     "pears",
//     "peas",
//     "pert",
//     "pest",
//     "pet",
//     "pets",
//     "raft",
//     "rafts",
//     "rap",
//     "rapt",
//     "rat",
//     "rate",
//     "rates",
//     "rats",
//     "ref",
//     "rep",
//     "rest",
//     "safe",
//     "safer",
//     "sap",
//     "sat",
//     "sea",
//     "sear",
//     "seat",
//     "set",
//     "spa",
//     "spar",
//     "spare",
//     "spat",
//     "spear",
//     "star",
//     "stare",
//     "step",
//     "strafe",
//     "strap",
//     "tap",
//     "tape",
//     "taper",
//     "tapers",
//     "tapes",
//     "tar",
//     "tarp",
//     "tarps",
//     "tea",
//     "tear",
//     "tears",
//     "trap",
//     "traps",
// ];




function validguess(guessword, words)
{
    var pos = words.indexOf(guessword);
    if (pos != -1){
	words.splice(pos, 1);
	return true;
	}
    else{
	return false;
    }
};

function fillfound(words)
{
    $.map(words, function(word, i){
	var word_id = "word_" + i;
	$("#found").append("<li> <ul id='" + word_id + "'> </ul> </li>");
	fillsingle(word, i);
    });
}

function fillword(guessword, words)
{
    var j = words.indexOf(guessword);
    fillsingle(guessword, j, false);
}


function fillsingle(word, index, blank=true)
{
    var letter_display = "";
    $.map(word.split(""), function(letter){
	var filler= (blank) ? " " : letter;
	letter_display += "<li>" + filler + "</li>";
    });
    $("#word_" + index).html(letter_display);
}

function handlekey(event){
    if (event.which == 8 || event.which == 46) 
    {
	removeguessletter();
	return false;
    }
    else if(event.which >=65 && event.which <=90){
	var guessletter = String.fromCharCode(event.which).toLowerCase();
	var remainingletters = $(document).data("remainingletters");
	var letterpos = remainingletters.indexOf(guessletter);
	if(letterpos != -1){ 
	    addguessletter(guessletter);
	    remainingletters.splice(letterpos, 1);
	    showletters("#letter", $(document).data("remainingletters"));
	}
	else{
	    console.log('Unavailable Letter');
	}
    }
    else if(event.which == 13){
	submitword($(document).data("guessword").join(""));
	$(document).data("guessword").length = 0;
    }
    else{console.log('Not A Valid Input');}
}

function addguessletter(letter){
    $(document).data("guessword").push(letter);
    showletters("#guess", $(document).data("guessword"));
    console.log("guessword = " +  $(document).data("guessword"));
    }

function removeguessletter(){
    var removed = $(document).data("guessword").pop();
    if (removed != undefined){
	$(document).data("remainingletters").push(removed);
	showletters("#guess", $(document).data("guessword"));
	showletters("#letter", $(document).data("remainingletters"));
	console.log("guessword = " + $(document).data("guessword"));
    }
    else{
	return false;
    }
}

function displayfound(){
    $('#foundcount').html(foundcount());
}

function foundcount(){
    return $(document).data("foundwords").length;
}

function displayrem(){
    var remdisplay = remcount() + " / " + wordtotal();
    $('#remcount').html(remdisplay);
}

function remcount(){
    return  wordtotal() - foundcount();
}

function wordtotal(){
return  $(document).data("resultwords").length;
}

function submitword(guessword){
    if(validguess(guessword, $(document).data("wordcopy"))){
	fillword(guessword, $(document).data("resultwords"));
	$(document).data("foundwords").push(guessword);
	scorecalc(guessword);
	displayfound();
	displayrem();
    }
    else{
	console.log("invalidword: " + guessword);
    }
    var guessword = [];
    showletters("#guess","");
    $(document).data("remainingletters", $(document).data("availableletters").slice(0));
    showletters("#letter", $(document).data("remainingletters"));
}

function scorecalc(word){
    var score = $(document).data("score");
    var scoreincrease = word.length;
    score += scoreincrease;
    $(document).data("score", score);
    $("#dynamicscore").html($(document).data("score"));
}

function showletters(id, string){
    $(id).children().remove();
    $.map(string, function(letter){
	$("<li>").html(letter).appendTo(id)
    });
}

$(function () {
    $.getJSON("data",function(result){
	$(document).data("availableletters", result["availableletters"]);
	var resultwords = subwords(result["availableletters"], result["words"]);
	$(document).data("resultwords", resultwords);
	$(document).data("remainingletters", result["availableletters"].slice(0));
	$(document).data("wordcopy", resultwords.slice(0));
	fillfound(resultwords);
	showletters("#letter", $(document).data("remainingletters"));
	$(document).data("guessword", []);
	$(document).data("score", 0);
	$("#dynamicscore").html($(document).data("score"));
	$(document).data("foundwords", []);
	displayfound();
	displayrem();
	$(document).keydown(handlekey);   
	});
   })

