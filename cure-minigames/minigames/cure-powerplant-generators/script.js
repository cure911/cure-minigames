let timer_start, timer_game, timer_finish, timer_time, timer_hide, letters, difficulty, valid_keys, timerStart;
let game_started = false;
let streak = 0;
let max_streak = 0;
let best_time = 0;

let diffrent = 0;
let reach = 10;

const sleep = (ms, fn) => {return setTimeout(fn, ms)};

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const getDifficulty = () => {
    switch(diffrent){
        case 0:
            return ["asd", 2000, 1000, 'easy'];
        case 1:
            return ["asdjkl", 1500, 750, 'medium'];
        case 2:
            return ["awsdgjikl", 1200, 500, 'hard'];
    }
}

// Difficulty changed
document.querySelectorAll('input[name="difficulty"]').forEach((el) => {
    el.addEventListener('change', function(){
        streak = 0;
        reset();
    });
});

document.addEventListener("keydown", function(ev) {
    let key_pressed = ev.key;
    if(game_started && valid_keys.includes(key_pressed) ){
        let element = letters[0].el;
        let top = -590 * element.dataset.progress;
        if(top < -475 && top > -580 && key_pressed === element.textContent){//
            letters[0].el.classList.add('green');
            streak++;
            if(streak > max_streak){
                max_streak = streak;
                document.cookie = "max-streak_powerplant_"+difficulty[3]+"="+max_streak;
            }
        }else{
            streak = 0;
            fail();
            letters[0].el.classList.add('red');
        }
        if(streak == reach){
            approve();
        }
        
        letters[0].stop();
        
        new mojs.Html({
            el: element,
            y: top,
            opacity: {
                1:0,
                duration: 500,
            },
            duration: 500,
            onComplete() {
                element.remove();
            },
        }).play();
        letters.splice(0,1);
    }
});

function approve(){
    console.log(true)
    letters[0].stop();
    game_started = false
    $('.text').text('Access Granted');
    $('.hack').addClass('hidden');
    $('.splash').removeClass('hidden')
    setTimeout(function(){
        $('body').hide()
        location.reload();
    }, 1500)
}

function fail(){  
    console.log(false)
    letters[0].stop();
    game_started = false
    setTimeout(function(){
        $('.text').text('Access Denied');
        $('.hack').addClass('hidden');
        $('.splash').removeClass('hidden')
        setTimeout(function(){
            $('body').hide()
            location.reload();
        }, 1500)
    },700)
}

let createLetter = () => {
    let pos = random(1,4);
    let lettersElem = document.querySelector('.minigame .letters');
    let div = document.createElement('div');
    div.classList.add('letter', 'pos'+pos);
    div.innerHTML = difficulty[0].charAt(random(0, difficulty[0].length - 1));
    lettersElem.append(div);
    let duration = difficulty[1];
    let lettersCnt = letters.length;
    letters.push(new mojs.Html({
        el: div,
        y: {
            0:-590,
            duration: duration,
            easing: 'linear.none',
            onProgress (p) {
                div.dataset.progress = p;
            },
        },
        opacity: {
            0:1,
            duration: 200,
            easing: 'linear.none'
        },
        duration: duration,
        onComplete() {
            div.classList.add('red');
            fail();
            streak = 0;
            letters.splice(0,1);
        },
        onUpdate() {
            if(game_started === false) this.pause();
        }
    }));
    letters[lettersCnt].then({
        opacity: 0,
        duration: 500,
        onComplete() {
            div.remove();
        },
    }).play()
}

function reset(restart = true){
    game_started = false;

    resetTimer();
    clearTimeout(timer_start);
    clearTimeout(timer_game);
    clearTimeout(timer_finish);
    clearTimeout(timer_hide);

    if(restart){
        document.querySelector('.minigame .hack').classList.add('hidden');
        document.querySelector('.minigame .splash').classList.remove('hidden');
        document.querySelector('.minigame .letters').innerHTML = '';
        start();
    }
}

function start(){
    $('body').show();
    $('.text').text('Pattern recognition required...');
    timer_start = sleep(1000, function(){
        document.querySelector('.minigame .splash').classList.add('hidden');
        document.querySelector('.minigame .hack').classList.remove('hidden');
        
        difficulty = getDifficulty();
        
        valid_keys = difficulty[0].split('');
        letters = [];
        game_started = true;
        
        timer_game = setInterval(createLetter, difficulty[2]);
    });
}

start();