

$(document).data("maxwordlength", 6);

function initialword(words)
{
    var maxwordlength = $(document).data("maxwordlength");
    return $.grep(words, function(word,i){return word.length == maxwordlength;})[0];
}


function validguess(guessword, words)
{
    var pos = words.indexOf(guessword);
    if (pos != -1 && !$(document).data("end")){
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

function Random(X) {
    return Math.floor(X*(Math.random()%1)) }

function shuffle(remletters){
    for (J=remletters.length-1 ; J>0 ; J--){
	K = Random(J+1) ; 
	T = remletters[J] ; 
	remletters[J] = remletters[K] ; 
	remletters[K] = T 
   }
    return remletters;
}

function handlekey(event){
    clearerror();
    if (event.which == 8 || event.which == 46) 
    {
	removeguessletter();
	return false;
    }
    else if(event.which == 32){
	var letters = $(document).data("remainingletters");
	shuffle(letters);
	showletters("#letter", $(document).data("remainingletters"));
    }
    else if(event.which >=65 && event.which <=90){
	var guessletter = String.fromCharCode(event.which);
	var remainingletters = $(document).data("remainingletters");
	var letterpos = remainingletters.indexOf(guessletter.toUpperCase());
	if(letterpos != -1){ 
	    addguessletter(guessletter);
	    remainingletters.splice(letterpos, 1);
	    showletters("#letter", $(document).data("remainingletters"));
	}
	else{
	    displayerror("Unavailable Letter");
	}
    }
    else if(event.which == 13){
	submitword($(document).data("guessword").join(""));
	$(document).data("guessword").length = 0;
    }
    else{displayerror("Not A Valid Input");}
}

function displayerror(message){
    $("#error").html(message);
}

function clearerror(){
    displayerror("");
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
	setcorrectclass(guessword, $(document).data("resultwords"));
	fillword(guessword, $(document).data("resultwords"));
	$(document).data("foundwords").push(guessword);
	scorecalc(guessword);
	displayfound();
	displayrem();
	wincheck();
    }
    else{
	console.log("invalidword: " + guessword);
    }
    var guessword = [];
    showletters("#guess","");
    $(document).data("remainingletters", $(document).data("availableletters").slice(0));
    showletters("#letter", $(document).data("remainingletters"));
}

function setcorrectclass(guessword, words){
    var index = words.indexOf(guessword);
    $("#word_" + index).addClass("foundword");
}

function wincheck(){
 if($(document).data("score") >= $(document).data("winscore")){
	$("#winkitten").removeClass("invisible");
     $(document).data("win", true);
		}
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

function timedisplay(seconds, blinking = false){
    var minute = Math.floor(seconds/60);
    var second = seconds%60 < 10 ? "0" + seconds%60 : seconds%60;
    if(blinking){
	$("#timer").html(minute + ":" + second).addClass("timeout");
    }
    else{
	$("#timer").html(minute + ":" + second).removeClass("timeout");    
    }
}

function timecountdown(){
    var timer = $(document).data("time");
    timer --;
    $(document).data("time", timer);
    if(timer <= 5 && timer >0){
	timedisplay(timer, true);
    }
    else if(timer >= 0){
	timedisplay(timer);
    }
        else{
	var time = $(document).data("interval");
	clearInterval(time);
	endgame();
    }
}

function endgame(){
    if(!$(document).data("win")){
	$("#losekitten").removeClass("invisible");
	console.log("lose");
	// playsound("beep-2.mp3");
    }
    $(document).data("end", true);
    var remaining = $(document).data("wordcopy");
    $.map(remaining, function(word){
	fillword(word, $(document).data("resultwords"));
    });
}

//  function playsound(soundname){
// 	var soundfile = $("<embed src='/sounds/" + soundname + "' hidden='true' autostart='true' loop='false' class='playSound'>");
//      console.log(soundfile);
//      soundfile.appendTo('body');
// }


$(function () {
    $.getJSON("data",function(result){
	var resultwords = result["result_words"]
	$(document).data("win", false);
	$(document).data("end", false);
	$(document).data("availableletters", result["availableletters"]);
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
	$(document).data("winscore", 50);
	$(document).data("time", 180);
	timedisplay($(document).data("time"));
	var time = setInterval(timecountdown, 1000);
	$(document).data("interval", time);
});
   })

