const clock = document.getElementById("clock");
const date = document.getElementById("date");

const soundBtn = document.getElementById("soundBtn");

const alarmTime = document.getElementById("alarmTime");
const setAlarmBtn = document.getElementById("setAlarmBtn");
const cancelAlarmBtn = document.getElementById("cancelAlarmBtn");
const alarmStatus = document.getElementById("alarmStatus");
const stopAlarmBtn = document.getElementById("stopAlarmBtn");

let soundEnabled = false;
let audioContext;

let alarmSet = false;
let alarmValue = "";

let alarmPlaying = false;
let alarmInterval;


// =========================
// DIGITAL CLOCK
// =========================

function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    clock.textContent =
        `${hours}:${minutes}:${seconds} ${ampm}`;

    date.textContent = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    if (soundEnabled) {
        playTick();
    }

    checkAlarm(now);
}


// =========================
// TICK SOUND
// =========================

function playTick() {

    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 900;

    gainNode.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.05
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.05
    );
}


// =========================
// SOUND BUTTON
// =========================

soundBtn.addEventListener("click", () => {

    if (!audioContext) {

        audioContext =
            new (window.AudioContext ||
            window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    soundEnabled = !soundEnabled;

    if (soundEnabled) {
        soundBtn.textContent = "🔊 Tick Sound ON";
    } else {
        soundBtn.textContent = "🔇 Tick Sound OFF";
    }
});


// =========================
// SET ALARM
// =========================

setAlarmBtn.addEventListener("click", () => {

    if (alarmTime.value === "") {

        alarmStatus.textContent =
            "Please select an alarm time.";

        return;
    }

    alarmValue = alarmTime.value;
    alarmSet = true;

    alarmStatus.textContent =
        `⏰ Alarm set for ${alarmValue}`;

    // Allow alarm audio
    if (!audioContext) {

        audioContext =
            new (window.AudioContext ||
            window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
});


// =========================
// CHECK ALARM
// =========================

function checkAlarm(now) {

    if (!alarmSet || alarmPlaying) return;

    const currentHours =
        String(now.getHours()).padStart(2, "0");

    const currentMinutes =
        String(now.getMinutes()).padStart(2, "0");

    const currentTime =
        `${currentHours}:${currentMinutes}`;

    if (currentTime === alarmValue) {

        alarmPlaying = true;

        alarmStatus.textContent =
            "🔔 ALARM RINGING!";

        startAlarmSound();
    }
}


// =========================
// ALARM SOUND
// =========================

function startAlarmSound() {

    alarmInterval = setInterval(() => {

        if (!audioContext) return;

        const oscillator =
            audioContext.createOscillator();

        const gainNode =
            audioContext.createGain();

        oscillator.type = "square";

        oscillator.frequency.value = 700;

        gainNode.gain.value = 0.15;

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.4
        );

    }, 700);
}


// =========================
// STOP ALARM
// =========================

stopAlarmBtn.addEventListener("click", () => {

    clearInterval(alarmInterval);

    alarmPlaying = false;
    alarmSet = false;

    alarmStatus.textContent =
        "Alarm stopped.";

});


// =========================
// CANCEL ALARM
// =========================

cancelAlarmBtn.addEventListener("click", () => {

    clearInterval(alarmInterval);

    alarmPlaying = false;
    alarmSet = false;

    alarmValue = "";

    alarmTime.value = "";

    alarmStatus.textContent =
        "No alarm set.";

});


// START CLOCK

updateClock();

setInterval(updateClock, 1000);