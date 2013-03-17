
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
	    var letter = letters.splice(0,1)[0];
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


var words = [
    "after",
    "are",
    "art",
    "arts",
    "ate",
    "ear",
    "ears",
    "east",
    "eat",
    "eats",
    "far",
    "fare",
    "fares",
    "farts",
    "fast",
    "faster",
    "fat",
    "fate",
    "fates",
    "fear",
    "fears",
    "feast",
    "feat",
    "fret",
    "par",
    "pare",
    "pares",
    "parse",
    "part",
    "parts",
    "past",
    "paste",
    "pat",
    "pats",
    "pea",
    "pear",
    "pears",
    "peas",
    "pert",
    "pest",
    "pet",
    "pets",
    "raft",
    "rafts",
    "rap",
    "rapt",
    "rat",
    "rate",
    "rates",
    "rats",
    "ref",
    "rep",
    "rest",
    "safe",
    "safer",
    "sap",
    "sat",
    "sea",
    "sear",
    "seat",
    "set",
    "spa",
    "spar",
    "spare",
    "spat",
    "spear",
    "star",
    "stare",
    "step",
    "strafe",
    "strap",
    "tap",
    "tape",
    "taper",
    "tapers",
    "tapes",
    "tar",
    "tarp",
    "tarps",
    "tea",
    "tear",
    "tears",
    "trap",
    "traps",
    "qfat",   
    "fatfatfat",
    "faster",
    "father",
    "fat"   
];




function validguess(guessword, words)
{
    return words.indexOf(guessword) != -1
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
	var filler= (blank) ? "_" : letter;
	letter_display += "<li>" + filler + "</li>";
    });
    $("#word_" + index).html(letter_display);
}

function handlekey(event){
    if (event.which == 8) 
    {
	removeguessletter();
    }
    else if(event.which >=65 && event.which <=90){
	var guessletter = String.fromCharCode(event.which).toLowerCase();
	var remainingletters = $(document).data("remainingletters");
	var letterpos = remainingletters.indexOf(guessletter);
	if(letterpos != -1){ 
	    addguessletter(guessletter);
	    remainingletters.splice(letterpos, 1);
	}
	else{
	    console.log('InvalidLetter');
	}
    }
    else if(event.which == 13){
	submitword($(document).data("guessword").join(""));
	$(document).data("guessword").length = 0;
    }
    else{console.log('InvalidLetter');}
}

function addguessletter(letter){
    $(document).data("guessword").push(letter);
    console.log("guessword = " +  $(document).data("guessword"));
    }

function removeguessletter(){
    $(document).data("remainingletters").push($(document).data("guessword").pop());
    console.log("guessword = " + $(document).data("guessword"));
}

function submitword(guessword){
    if(validguess(guessword, $(document).data("resultwords"))){
	fillword(guessword, $(document).data("resultwords"));
    }
    else{
	console.log("invalidword");
    }
    var guessword = [];
    $(document).data("remainingletters", $(document).data("availableletters").slice(0));
}


$(function () {
    var availableletters = 'faster'.split("");
    var resultwords = subwords(availableletters, words);
    $(document).data("availableletters", availableletters);
    $(document).data("resultwords", resultwords);
    $(document).data("guessword", []);
    $(document).data("remainingletters", availableletters.slice(0));
    fillfound(resultwords);
    $(document).keydown(handlekey);
})

