const SPRITES = {
    idle1: { row: 0, frames: 4, delay: 400 },
    idle2: { row: 1, frames: 4, delay: 400 },
    clean1: { row: 2, frames: 4, delay: 200 },
    clean2: { row: 3, frames: 4, delay: 200 },
    walk: { row: 4, frames: 8, delay: 120 },
    run: { row: 5, frames: 8, delay: 100 },
    sleep: { row: 6, frames: 4, delay: 900 }
};

const frameWidth = 160;
const frameHeight = 160;
let frame = 0;
let catState = "idle1";
let animTimer;
let actionTimer;
const cat = document.getElementById('cat');
const STATES = ["sleep", "idle1", "idle2", "clean1", "clean2"];

function setCatState(state) {
    catState = state;
    frame = 0;
    clearInterval(animTimer);

    const s = SPRITES[catState];
    animTimer = setInterval(() => {
        cat.style.backgroundPosition = `-${frame * frameWidth}px -${s.row * frameHeight}px`;
        frame = (frame + 1) % s.frames;
    }, s.delay);

    clearTimeout(actionTimer);

    let nextDelay;
    if (catState === "sleep") nextDelay = 20000;
    else if (catState.startsWith("idle1")) nextDelay = 15000;
    else if (catState.startsWith("clean1")) nextDelay = 4000;
    else if (catState.startsWith("idle2")) nextDelay = 15000;
    else if (catState.startsWith("clean2")) nextDelay = 4000;

    actionTimer = setTimeout(() => {
        let next;
        do {
            next = STATES[Math.floor(Math.random() * STATES.length)];
        } while (next === catState);
        setCatState(next);
    }, nextDelay);
}
setCatState("idle1");

function playFallAnimation(callback) {
    clearInterval(animTimer);
    clearTimeout(actionTimer);
    catState = "fall";
    const fallFrames = [3, 4, 5, 6];
    let i = 0;
    cat.style.transition = "transform 0.8s cubic-bezier(.5,1.8,.5,.8)";
    cat.style.transform = "translateY(-200px)";
    cat.style.backgroundPosition = `-${fallFrames[0] * frameWidth}px -${8 * frameHeight}px`;
    setTimeout(() => {
        cat.style.transition = "transform 0.8s cubic-bezier(.5,1.1,.6,1)";
        cat.style.transform = "translateY(0px)";
        animTimer = setInterval(() => {
            cat.style.backgroundPosition = `-${fallFrames[i] * frameWidth}px -${8 * frameHeight}px`;
            i++;
            if (i >= fallFrames.length) {
                clearInterval(animTimer);
                if (callback) callback();
            }
        }, 150);
    }, 200);
}

function typeEffect(element, text, delay = 80, callback) {
    element.textContent = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, delay);
        } else if (callback) {
            callback();
        }
    }
    type();
}

window.addEventListener("DOMContentLoaded", function () {
    const avatarText = document.querySelector('.avatar-text');
    const catText = document.querySelector('.cat-text');
    setTimeout(() => {
        typeEffect(avatarText, "Hi, This is Me", 80, function () {
            setTimeout(() => {
                typeEffect(catText, "AND MY CAT !", 100);
            }, 500);
        });
    }, 1000);
    const avatarImg = document.querySelector('.avatar-img');
    let toggle = false;
    setInterval(() => {
        avatarImg.src = toggle ? 'imgs/me.png' : 'imgs/me2.png';
        toggle = !toggle;
    }, 1000);
});

new fullpage('#fullpage', {
    autoScrolling: true,
    navigation: true,
    onLeave: function (origin, destination, direction) {
        if (direction === "down") {
            playFallAnimation(() => {
                setCatState("idle1");
            });
        }
    }
});