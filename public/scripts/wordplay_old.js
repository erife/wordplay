

$(document).data("maxwordlength", 6);

function initialword(words)
{
    var maxwordlength = $(document).data("maxwordlength");
    return $.grep(words, function(word,i){return word.length == maxwordlength;})[0];
}


function validguess(guessword, words)
{
    var pos = words.indexOf(guessword);
    if (pos != -1 && $(document).data("state") == "running"){
	words.splice(pos, 1);
	return true;
	}
    else{
	return false;
    }
};

function fillfound(words)
{
    clearfill();
    $.map(words, function(word, i){
	fillsingle(word, i, true);
    });
}

function fillword(guessword, words)
{
    var j = words.indexOf(guessword);
    fillsingle(guessword, j, false);
}


function fillsingle(word, index, blank)
{
    var letter_display = "";
    $.map(word.split(""), function(letter){
	var filler= (blank) ? " " : letter;
	letter_display += "<li>" + filler + "</li>";
    });
    $("#word_" + index).html(letter_display);
}

function clearfill(){
    for(i=0; i<=120; i++){
	$("#word_" + i).html("");
	$("#word_" + i).removeClass("foundword");
    }
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
    showletters("#letter", $(document).data("remainingletters"));
}

function buttonshuffle(){
    shuffle($(document).data("remainingletters"));
}


function handlekey(event){
    clearerror();
    if(event.target.localName != "input"){
	if (event.which == 8 || event.which == 46) 
	{
	    removeguessletter();
	    return false;
	}
	else if(event.which == 32){
	    var letters = $(document).data("remainingletters");
	    shuffle(letters);
	}
	else if(event.which == 27){
	    endgame();
	}
	else if(event.which == 16){
	    if($(document).data("state") == "stopped"){
		startgame();
	    }
	    else if($(document).data("win")){
		nextword();
	    }
	    else return;
	}
	else if(event.which >=65 && event.which <=90){
	    var guessletter = String.fromCharCode(event.which);
	    handleletter(guessletter);
	}
	else if(event.which == 13){
	    submitword($(document).data("guessword").join(""));
	    $(document).data("guessword").length = 0;
	}
	else{displayerror("Not A Valid Input");}
    }
}

function buttonsubmit(){
    submitword($(document).data("guessword").join(""));
    $(document).data("guessword").length = 0;
}


function handleletter(guessletter){
    var remainingletters = $(document).data("remainingletters");
    var guessword = $(document).data("guessword");
    var letterpos = remainingletters.indexOf(guessletter.toUpperCase());
    var letterpos2 = guessword.indexOf(guessletter.toUpperCase());
    if(letterpos != -1){ 
	addguessletter(guessletter);
	remainingletters.splice(letterpos, 1);
	showletters("#letter", $(document).data("remainingletters"));
    }
    else if(letterpos2 != -1){
	$(document).data("guessword").splice(letterpos2, 1);
	removeletter(guessletter);
    }
    else{
	displayerror("Unavailable Letter");
    }
}

function handleletterclick(event){
    var letter = $(event.target).html();
    handleletter(letter);
}

function removeletter(letter){
    $(document).data("remainingletters").push(letter);
    showletters("#guess", $(document).data("guessword"));
    showletters("#letter", $(document).data("remainingletters"));
    console.log("guessword = " + $(document).data("guessword"));
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
	removeletter(removed);
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
	addtime(guessword);
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
	$("#newround").removeClass("invisible");
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
    $(id + "  li").click(handleletterclick);
   }

function timedisplay(seconds, blinking){
    var minute = Math.floor(seconds/60);
    var second = seconds%60 < 10 ? "0" + seconds%60 : seconds%60;
    if(blinking){
	$("#timer").html(minute + ":" + second).addClass("timeout");
    }
    else{
	$("#timer").html(minute + ":" + second).removeClass("timeout");    
    }
}

function addtime(word){
    var time = $(document).data("time");
    switch(word.length)
    {
    case 4:
	time += 5;
	break;
    case 5:
	time += 10;
	break;	
    case 6:
	time += 20;
	break;
    }
    timedisplay(time, false);
    $(document).data("time", time);
}


function timecountdown(){
    var timer = $(document).data("time");
    timer --;
    $(document).data("time", timer);
    if(timer <= 5 && timer >0){
	timedisplay(timer, true);
    }
    else if(timer >= 0){
	timedisplay(timer, false);
    }
    else{
	var time = $(document).data("interval");
	clearInterval(time);
	endgame();
    }
}

function endgame(){
    if($(document).data("state") == "running"){
	if(!$(document).data("win")){
	    $("#losekitten").removeClass("invisible");
	}
	$(document).data("state", "stopped");
	$(document).data("time", 0);
	timedisplay(0, false);
	var time = $(document).data("interval");
	clearInterval(time);
	var remaining = $(document).data("wordcopy");
	validhighscore($(document).data("score"));
	if(remaining){
	    $.map(remaining, function(word){
		fillword(word, $(document).data("resultwords"));
	    });
	}
	return;
    }
}

function startgame(){
    console.log("click");
    initializeconstants();
    endgame();
    nextword();
    $(document).data("state", "running");
    clockstart();
    $("#start").blur();
    $("#end").blur();
}

function startclock(){
    if($(document).data("interval")){
	clearInterval($(document).data("interval"));
    }
    var time = setInterval(timecountdown, 1000);
    $(document).data("interval", time);
}

function initializegame(){
    $.getJSON("data",function(result){
	$("#winkitten").addClass("invisible");
	$("#losekitten").addClass("invisible");
	var resultwords = result["result_words"]
	$(document).data("availableletters", result["availableletters"]);
	$(document).data("resultwords", resultwords);
	$(document).data("remainingletters", result["availableletters"].slice(0));
	$(document).data("wordcopy", resultwords.slice(0));
	$("#dynamicscore").html($(document).data("score"));
	fillfound($(document).data("resultwords"));
	showletters("#letter", $(document).data("remainingletters"));
	displayfound();
	displayrem();
    });
}

function clockstart(){
    timedisplay($(document).data("time"), false);
    startclock();
}

function initializeconstants(){
    $(document).data("state", "stopped");
    $(document).data("score", 0);
    $(document).data("winscore", 0);
    $(document).data("time", 180);
}

function nextword(){
    $("#newround").addClass("invisible");
     $("#newround").blur();
    $(document).data("win", false); 
    $(document).data("guessword", []);
    $(document).data("foundwords", []);
    initializegame();
    var score = $(document).data("score");
    var winscore = score + 50;
    $(document).data("winscore", winscore);
}




//  function playsound(soundname){
// 	var soundfile = $("<embed src='/sounds/" + soundname + "' hidden='true' autostart='true' loop='false' class='playSound'>");
//      console.log(soundfile);
//      soundfile.appendTo('body');
// }

function showscore(){
    $.getJSON("highscore", function(result){
	$.map(result["high_score"], function(data, i){
	    var name = data.name;
	    var score = data.score;
	    $("#hs_" + i + " td.name").html(name);
	    $("#hs_" + i + " td.score").html(score);
	});
	$("#highscore").removeClass("invisible");
    });
}

function handlenewhighscore(event){
    event.preventDefault();
    var name = event.target.namebox.value;
    var score = $(document).data("score");
    var sendscore = {
	name: name, 
	score: score
	}
    console.log(name);
    console.log(score);
    $.post("name", sendscore, showscore);
    $("#newhighscore").addClass("invisible");
    showscore();
    return false;
}


function hidescore(event){
    $("#highscore").addClass("invisible");
}

function validhighscore(score){
    try{
    $ .getJSON("validhighscore", {"score":score}, function(result){
	if(result["valid"]){
	    console.log(result);
	    $("#newhighscore").removeClass("invisible");
	}
	else{
	    console.log(result);
	    showscore();
	}
    });
    }
    catch(exception){
	    console.log(exception);
    }
}

$(function () {
    $(document).keydown(handlekey);
    $(document).data("state", "stopped");
    $("#newhighscoreform").submit(handlenewhighscore);
    $("#highscore").click(hidescore);
    $("#shuffle").click(buttonshuffle);
    $("#submit").click(buttonsubmit);
    $("#newround").click(nextword);
})

// format list of lists into table
// send score to server before displaying high score panel
// display high score panel when handling game end
//
