const words = [
    "tie",
    "permission",
    "abridge",
    "humor",
    "fashionable",
    "elapse",
    "eagle",
    "threshold",
    "thoughtful",
    "recovery",
    "update",
    "heavy",
    "fault",
    "hard",
    "night",
    "exposure",
    "password",
    "brush",
    "situation",
    "marketing",
    "creep"
];

let guess;
let score = 0;
let count = 0;
let rightGuessCount = 0;
let lettersChosen = [];
let lives = 8;
let hints = 3;
let word = chooseWord();
$("#next-btn").hide();
console.log(word);



const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 5;





// Check when the player choose a letter
const test = $(".letter-btn").click(function (e) { 
    
    e.preventDefault();
    
    const letter = $(this).html();
 
    if(lettersChosen.indexOf(letter) !== -1){
        alert("The letter is already used")
    }

    //to check if the game ended so the player can't guess anymore
    if(lettersChosen.indexOf(letter) === -1 && rightGuessCount !== word.length && lives > 0){
        
        //in case the player guessed the letter wrong he'll lose a live
        if(!check(letter)){
            draw(--lives);
            $("#lives").html(`Lives: ${lives} `);
        }
        
        console.log(guess);
        console.log(rightGuessCount);
        
        //if the player guessed all the letters right he'll get the score he earned
        if(rightGuessCount === word.length){
            $('#next-btn').show();
        }

        if(lives == 0){
            lostInterface();
        }

     
        lettersChosen.push(letter);
        $(this).removeClass('btn-warning');
        $(this).addClass('btn-secondary');

        $("#user-guesses").html(guess);
    }     
    
});




$("#hint-btn").click(function (e) { 
    e.preventDefault();

    if(hints > 0){
        let letter;
    let rand;
    do{
        rand = Math.floor(Math.random() * word.length);
        letter = word[rand];
    } while(lettersChosen.indexOf(letter) != -1)
   
    console.log(rand);
    console.log(letter);

    check(letter);
    lettersChosen.push(letter);
    $("#" + letter).removeClass('btn-warning');
    $("#" + letter).addClass('btn-secondary');

    $("#hints").html('hints: ' + --hints);
    $("#user-guesses").html(guess);
    if(rightGuessCount === word.length){
        $('#next-btn').show();
    }
    

    } else {
        window.alert("You used all your hints");
    }
    

});



$("#next-btn").click(function (e) { 
    e.preventDefault();
    console.log("BITCH");
    newRound();
});

















//replace the hidden letter with the actual letter to shpw it for the player
function replace(old, rep, ind){
    return old.substring(0, ind) + rep + old.substring(ind+1); 
}

function newRound(){
    
    score += rightGuessCount;
    $("#score").html(`Score: ${score}`);
    word = chooseWord();
    rightGuessCount = 0;
    count++;
    $("#next-btn").hide();

    lettersChosen.forEach(element => {
        $(`#${element}`).removeClass('btn-secondary');
        $(`#${element}`).addClass('btn-warning');
    });

    lettersChosen = [];
    
}


function draw(lives){
    switch(lives){
        case 7: {
            lineAnimation(10, 300, 10, 50);
            break;
        }
        
        case 6: {
            lineAnimation(10, 50, 170, 50);
            break;
        }

        case 5: {
            ctx.moveTo(10, 100)
            lineAnimation(10, 100, 80, 50);

            break;
        }

        case 4: {
            ctx.moveTo(170, 50);
            lineAnimation(170, 50, 170, 115);
            break;
        }

        case 3: {
            circleAnimation();
            break;
        }

        case 2: {
            ctx.moveTo(170, 175);
            lineAnimation(170, 175, 170, 240);
            break;
        }

        case 1: {
            ctx.moveTo(200, 210);
            lineAnimation(200, 210, 170, 180);
            setTimeout(()=>{lineAnimation(170, 180, 140, 210)}, 100) ;
            break;
        }

        case 0:{
            ctx.moveTo(200, 270);
            lineAnimation(200, 270, 170, 240);
            setTimeout(()=>{lineAnimation(170, 240, 140, 270)}, 100) ;
            break;
        }

    }
}



function lineAnimation(x1, y1, x2, y2){
    const drawing = setInterval(()=>{
        
        if(x1 < x2) x1 += 5;
        else if(x1 > x2) x1 -= 5;

        if(y1 < y2) y1 += 5;
        else if(y1 > y2) y1 -= 5;

        ctx.lineTo(x1, y1);
        ctx.stroke();

        if(x1 === x2 && y1 === y2){
            clearInterval(drawing);
        }

    }, 1)
}



function circleAnimation(){
    let radius = 0;
    
    const drawing = setInterval(()=>{
        ctx.beginPath()
       
        ctx.arc(170, 145, 30, radius * Math.PI, 1.5 * Math.PI, 2 * Math.PI)
        ctx.stroke();
       
        radius += 0.05;
        console.log(radius);
        if(radius > 5){
            clearInterval(drawing);
        }

    }, 1)
}   






function lostInterface(){
    $("#game-interface").addClass("col-6 text-center");
    $("#hangman-animation").addClass("col-6 ps-5");
    $("#cnv").addClass("pb-5");
    $("#game-interface").removeClass("col-7");
    $("#hangman-animation").removeClass("col");
   
    $("#game-interface").html(
        `<h1 class = "mt-5 display-2"> You Lost </h1>
         <h1>Score: ${score}</h1> 
         <h1>Words: ${count}</h1> 
         <form method = 'post' action = '/finish'>
            <input type = "hidden" name = "score" value = "${score}">
            <input type = "hidden" name = "words" value = "${count}">
            <button id = "Main-Menu" class = "btn btn-lg btn-warning">Main Menu</button>
         </form>`
    );
}


function check(letter){
    let flag = false;
    let stringCount = 0;

    
    for(let i = 0; i < word.length; i++){
        
        //if the player guessed the hidden right it well be showed to him  
        if(letter == word[i]){
            guess = replace(guess, word[i], stringCount);
            rightGuessCount++;
            flag = true;
        }
        
        stringCount += 2;
    }


    return flag;
}


function chooseWord(){
    const choosenWord = words[Math.floor(Math.random() * 21)];
    guess = '';
    for(let i = 0; i < choosenWord.length; i++){
        guess = guess + '_ ';
    }

    $('#user-guesses').html(guess);
    return choosenWord;
}




