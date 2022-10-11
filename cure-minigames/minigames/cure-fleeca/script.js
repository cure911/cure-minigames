var speedSel = 10000;
var streakSel = 1;

class Cure_Fleeca{

    range = (start, end, length = end - start + 1) => {
        return Array.from({ length }, (_, i) => start + i)
    }
    random = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    shuffle = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    shapes = ['square', 'rectangle', 'circle', 'triangle'];
    inner_shapes = ['square', 'square2', 'rectangle', 'rectangle2', 'circle', 'circle2', 'triangle'];
    colors = ['blue', 'green', 'red', 'orange', 'yellow', 'purple', 'black', 'white'];
    types = [
        {'type': 'background_color','text': 'ARKAPLAN RENGİ'},
        {'type': 'number_color','text': 'RAKAM RENGİ'},
        // Shape
        {'type': 'shape','text': 'ŞEKİL'},
        {'type': 'shape_color','text': 'ŞEKİL RENGİ'},
        // Inner shape
        {'type': 'inner_shape','text': 'İÇ ŞEKİL'},
        {'type': 'inner_shape_color','text': 'İÇ ŞEKİL RENGİ'},
        // Upper text - Color
        {'type': 'text_color','text': 'YAZI RENGİ'},
        {'type': 'text_color_bg_color','text': 'YAZI ARKAPLAN RENGİ'},
        // Bottom text - Shape
        {'type': 'text_shape','text': 'ŞEKİL YAZISI'},
        {'type': 'text_shape_bg_color','text': 'ŞEKİL YAZI ARKAPLAN RENGİ'}
    ];

    create(){
        let real_numbers, impostor_numbers, minigame, group, background_colors, text_colors, types, quiz_numbers;

        real_numbers = this.range(1, 4);
        this.shuffle(real_numbers);

        impostor_numbers = this.range(1, 4);
        this.shuffle(impostor_numbers);

        minigame = {
            'real_numbers': real_numbers,
            'impostor_numbers': impostor_numbers,
            'groups': []
        };

        for(let i = 0; i < 4; i++){
            group = [];

            background_colors = [...this.colors];
            this.shuffle(background_colors);

            text_colors = [...this.colors];
            this.shuffle(text_colors);

            group['real_number'] = real_numbers[i];
            group['impostor_number'] = impostor_numbers[i];

            group['background_color'] = background_colors[0];
            group['number_color'] = this.colors[this.random(0, this.colors.length)];

            group['shape'] = this.shapes[this.random(0, this.shapes.length)];
            group['shape_color'] = background_colors[1];

            group['inner_shape'] = this.inner_shapes[this.random(0, this.inner_shapes.length)];
            group['inner_shape_color'] = background_colors[2];

            group['text_color'] = this.colors[this.random(0, this.colors.length)];
            group['text_color_bg_color'] = text_colors[0];

            group['text_shape'] = this.shapes[this.random(0, this.shapes.length)];
            group['text_shape_bg_color'] = text_colors[1];

            minigame['groups'].push(group);
        }

        quiz_numbers = this.range(0, 3);
        this.shuffle(quiz_numbers);

        types = [...this.types];
        this.shuffle(types);

        let solution1 = minigame['groups'][quiz_numbers[0]][types[0]['type']];
        let solution2 = minigame['groups'][quiz_numbers[1]][types[1]['type']];
        solution1 = solution1.replace(/\d/,'');
        solution2 = solution2.replace(/\d/,'');

        minigame['quiz1'] = {
            'pos': quiz_numbers[0],
            'type': types[0],
            'solution': solution1
        };

        minigame['quiz2'] = {
            'pos': quiz_numbers[1],
            'type': types[1],
            'solution': solution2
        };

        minigame['solution'] = solution1 +' '+ solution2;
        return minigame;
    }
}

let timer_start, timer_numbers, timer_game, timer_splash, data, speed;
let mode = 'fleeca';
let minigame = new Cure_Fleeca();
let streak = 0;
let max_streak = 0;
let game_started = false;

// Get max streak from cookie
const regex = /max-streak=([\d]+)/g;
let cookie = document.cookie;
if((cookie = regex.exec(cookie)) !== null){
    max_streak = cookie[1];
}

let sleep = (ms, fn) => {return setTimeout(fn, ms)};

let audio_splash = document.querySelector('.splash audio');
let audio_timer = document.querySelector('.timer audio');

// Options
document.querySelectorAll('.game_mode .button').forEach(el => {
    el.addEventListener('click', function(ev){
        let new_mode = ev.target.dataset.mode;
        if(new_mode !== mode){
            let b = document.querySelector('body').classList;
            b.remove(mode);
            b.add(new_mode);
            mode = new_mode;
            streak = 0;
            reset(true);
        }
    });
});


// Resets


document.addEventListener("DOMContentLoaded", function() {
    streak = 0;
    reset(true);
});
// document.querySelector('.answer .btn_again').addEventListener('click', function() {
//     streak = 0;
//     reset();
// });

// Process answer
document.querySelector('#answer').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && game_started === true) {
        game_started = false;

        clearTimeout(timer_game);
        audio_timer.pause();

        var answer = e.target.value.toLowerCase().trim();
        let wrapper = document.querySelector('.answer-wrapper');
        
        answer = answer.replace('yeşil', 'green')
        answer = answer.replace('kırmızı', 'red')
        answer = answer.replace('turuncu', 'orange')
        answer = answer.replace('sarı', 'yellow')
        answer = answer.replace('mor', 'purple')
        answer = answer.replace('siyah', 'black')
        answer = answer.replace('beyaz', 'white')
        answer = answer.replace('kare', 'square')
        answer = answer.replace('dikdörtgen', 'rectangle')
        answer = answer.replace('yuvarlak', 'circle')
        answer = answer.replace('üçgen', 'triangle')
        answer = answer.replace('mavi', 'blue')

        if(data.solution === answer){
            wrapper.classList.remove('wrong');
            wrapper.classList.add('right');
            streak++;
            if(streak > max_streak){
                max_streak = streak;
                document.cookie = "max-streak="+max_streak;
            }
            if( (mode === 'fleeca' && streak === streakSel)){
                splash_screen();
                document.querySelector('.splash .fa').innerHTML = '&#xf21b;';
                document.querySelector('.splash .message').innerText = "Sistem atlandı.";
                console.log(true)
                setTimeout(function(){
                    $('.practice').css('display', 'none');
                    location.reload();
                },1000)
            }else{
                reset();
            }

        }else{
            streak = 0;
            if(mode === 'practice') {
                wrapper.classList.remove('right');
                wrapper.classList.add('wrong');
                document.querySelector('.solution').classList.remove('hidden');
            }else{
                splash_screen();
                document.querySelector('.splash .fa').innerHTML = '&#xf05e;';
                document.querySelector('.splash .message').innerText = "Sistem cevabınızı onaylamadı";
                console.log(false)
                setTimeout(function(){
                    $('.practice').css('display', 'none');
                    location.reload();
                },1000)
            }
        }
    }
});

let invertText = () => {
    document.querySelectorAll('.group').forEach(el => {
        if( Math.round(Math.random()) === 1 || Math.round(Math.random()) === 1 )
            el.classList.toggle('invert');
    });
}

let splash_screen = (show = true) => {
    if(show){
        document.querySelectorAll('.groups, .timer, .question, .answer, .solution').forEach(
            el => {el.classList.add('hidden');});
        document.querySelector('.splash').classList.remove('hidden');
    }else{
        document.querySelector('.splash').classList.add('hidden');
        document.querySelectorAll('.groups').forEach(el => {el.classList.remove('hidden');});
    }
}

let reset = (show_splash = false) => {
    clearTimeout(timer_start);
    clearTimeout(timer_numbers);
    clearTimeout(timer_game);
    clearTimeout(timer_splash);

    audio_splash.pause();
    audio_splash.currentTime = 0;

    audio_timer.pause();
    audio_timer.currentTime = 0;

    document.querySelectorAll('.group > div, .timer, .question, .answer, .solution').forEach(el => {
        el.classList.add('hidden');
    });
    document.querySelectorAll('.real_number').forEach(el => {
        el.innerHTML = '&nbsp;';
        el.style.fontSize = '190px';
        el.classList.remove('hidden');
    });
    document.querySelectorAll('.group .shape').forEach(el => {
        minigame.shapes.forEach(shape => {
            el.classList.remove(shape);
        });
    });
    document.querySelectorAll('.groups .inner_shape').forEach(el => {
        minigame.inner_shapes.forEach(shape => {
            el.classList.remove(shape);
        });
    });
    document.querySelectorAll('.group, .group div, .group .shape, .groups .inner_shape').forEach(el => {
        el.classList.remove('invert');
        el.classList.forEach(cl => {
            if( /^(bg_|txt_)/.test(cl) ) {
                el.classList.remove(cl);
            }
        });
    });

    document.querySelector('#answer').blur();

    document.querySelector(".progress-bar").style.width = '100%';

    document.querySelector('.answer-wrapper').classList.remove('wrong', 'right')
    document.querySelector('.solution').classList.add('hidden');
    document.querySelector('#answer').value = '';

    if(show_splash)
        splash();
    else
        start();
}

let start = () => {
    data = minigame.create();

    data.groups.forEach(function(group, i) {
        let g = document.querySelectorAll('.groups .group')[i];
        group.text_color = group.text_color.replace('green', 'yeşil')
        group.text_color = group.text_color.replace('red', 'kırmızı')
        group.text_color = group.text_color.replace('orange', 'turuncu')
        group.text_color = group.text_color.replace('yellow', 'sarı')
        group.text_color = group.text_color.replace('purple', 'mor')
        group.text_color = group.text_color.replace('black', 'siyah')
        group.text_color = group.text_color.replace('white', 'beyaz')
        group.text_color = group.text_color.replace('square', 'kare')
        group.text_color = group.text_color.replace('rectangle', 'dikdörtgen')
        group.text_color = group.text_color.replace('circle', 'yuvarlak')
        group.text_color = group.text_color.replace('triangle', 'üçgen')
        group.text_color = group.text_color.replace('blue', 'mavi')
        group.text_shape = group.text_shape.replace('green', 'yeşil')
        group.text_shape = group.text_shape.replace('red', 'kırmızı')
        group.text_shape = group.text_shape.replace('orange','turuncu')
        group.text_shape = group.text_shape.replace('yellow', 'sarı')
        group.text_shape = group.text_shape.replace('purple', 'mor')
        group.text_shape = group.text_shape.replace('black', 'siyah')
        group.text_shape = group.text_shape.replace('white', 'beyaz')
        group.text_shape = group.text_shape.replace('square', 'kare')
        group.text_shape = group.text_shape.replace('rectangle', 'dikdörtgen')
        group.text_shape = group.text_shape.replace('circle', 'yuvarlak')
        group.text_shape = group.text_shape.replace('triangle', 'üçgen')
        group.text_shape = group.text_shape.replace('blue', 'mavi')

        g.classList.add('bg_'+group.background_color);
        g.querySelector('.real_number').innerHTML = group.real_number;
        g.querySelector('.shape').classList.add(group.shape, 'bg_'+group.shape_color);
        g.querySelector('.text_color').classList.add('txt_'+group.text_color_bg_color);
        g.querySelector('.text_color').innerHTML = group.text_color;
        g.querySelector('.text_shape').classList.add('txt_'+group.text_shape_bg_color);
        g.querySelector('.text_shape').innerHTML = group.text_shape;
        g.querySelector('.inner_shape').classList.add(group.inner_shape, 'bg_'+group.inner_shape_color);
        g.querySelector('.number').classList.add('txt_'+group.number_color);
        g.querySelector('.number').innerHTML = group.impostor_number;
    });


    // document.querySelector('.quiz1').innerHTML = data.quiz1.type.text + ' ('+data['real_numbers'][data.quiz1.pos]+')';
    // document.querySelector('.quiz2').innerHTML = data.quiz2.type.text + ' ('+data['real_numbers'][data.quiz2.pos]+')';
    $('.quiz1').html(`${data.quiz1.type.text} (${data['real_numbers'][data.quiz1.pos]})`);
    $('.quiz2').html(data.quiz2.type.text + ' ('+data['real_numbers'][data.quiz2.pos]+')');

    
    document.querySelector('.solution .real_numbers').innerHTML = data.real_numbers.join(' ');

    document.querySelector('.solution .solution_text').innerHTML = data.solution;

    timer_start = sleep(1000, function(){
        document.querySelectorAll('.real_number').forEach(el => {el.style.fontSize = '0px';});

        timer_numbers = sleep(2000, function(){
            $('.question').removeClass('hidden')
            game_started = true;

            document.querySelectorAll('.group > div, .timer, .answer').forEach(
                el => {el.classList.remove('hidden');});
            document.querySelectorAll('.group .real_number').forEach(el => {el.classList.add('hidden');});

            audio_timer.play();

            document.querySelector('#answer').focus({preventScroll: true});

            speed = speedSel;
            document.querySelector(".progress-bar").style.transitionDuration = speed+'s';
            document.querySelector(".progress-bar").style.width = '0px';
            speed *= 1000;

            timer_game = sleep(speed, function(){
                game_started = false;
                streak = 0;
                audio_timer.pause();
                if(mode === 'practice') {
                    let answer = document.querySelector('.answer-wrapper');
                    answer.classList.remove('right');
                    answer.classList.add('wrong');
                    document.querySelector('.solution').classList.remove('hidden');
                }else{
                    splash_screen();
                    document.querySelector('.splash .fa').innerHTML = '&#xf05e;';
                    document.querySelector('.splash .message').innerText = "Sistem cevabınızı onaylamadı";
                    console.log(false)
                }
            });
        });
    });

}

let splash = () => {
    if(mode === 'practice'){
        splash_screen(false);
        document.querySelector('.answer .btn_again').classList.remove('hidden');
        start();
    }else{

        splash_screen();
        document.querySelectorAll('.btn_again').forEach(el => {el.classList.add('hidden');});
        document.querySelector('.splash .fa').innerHTML = '&#xf21b;';
        document.querySelector('.splash .message').innerText = 'Cihaz açılıyor...';
        timer_splash = sleep(3000, function(){
            document.querySelector('.splash .message').innerText = 'Bağlanılıyor...';
            audio_splash.play();

            timer_splash = sleep(8000, function(){
                document.querySelector('.splash .message').innerText = 'Bağlantı kuruluyor...';

                timer_splash = sleep(6000, function(){
                    document.querySelector('.splash .message').innerText = 'Bazı hacker işleri yapıyorsun...';

                    timer_splash = sleep(6000, function(){
                        document.querySelector('.splash .message').innerText = 'Erişim kodu işaretlendi; insan doğrulaması gerekli...';

                        timer_splash = sleep(6000, function(){
                            document.querySelector('.splash').classList.add('hidden');
                            document.querySelector('.groups').classList.remove('hidden');
                            start();
                        });
                    });
                });
            });
        });
    }
}