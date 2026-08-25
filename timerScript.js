const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const panel = document.querySelector('.settingsPanel');
const tab = document.getElementById('showPanel');
const workSound = new Audio('./getToWork.mp3');
const breakSound = new Audio('./scoreBeep.mp3');
const longBreakSound = new Audio('./retroFanfare.wav');

let workDuration = 0.1 * 60; //seconds for work
let restDuration = 0.1 * 60; //seconds for rest
let longRest = restDuration * 5;
let timeLeft = workDuration;
let longRestInterval = 5;
let count = 0;
let timer = null;
let isPaused = false;
let isWorkTime = true;

//-----Timer Logic------------------------------------------------------------------------------------

//Functionality to return the remaining minutes and seconds.
function updateTimerDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    timerDisplay.textContent = `${minutes}:${seconds}`;
}

//Start the timer, set the interval (in milliseconds), and reduce the timeLeft at each interval.
function startTimer() {
    updateTimerDisplay();

    if(isPaused){
        startBtn.textContent = "Start";
    }
    
    timer = setInterval(() => {
        if(timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        }
        //When the timer reaches 00:00, clear the interval, flip the flag to "Rest Time", and start a new countdown.
        else{
            clearInterval(timer);
            timer = null;
            updateTimerDisplay();
            resetTimer();
            checkTimeFlag();
            startTimer();
        }
    }, 1000);
}

//Check the isWorkTime flag and assign the appropriate value
function checkTimeFlag() {
    if (isWorkTime && timeLeft > 0) {
        count++;
        console.log(count);
        if ((count % longRestInterval) === 0 && count != 0) {
            isWorkTime = false;
            timeLeft = longRest;
            document.getElementById("status").textContent = "Long Rest";
            longBreakSound.play();
        }
        else {
            isWorkTime = false;
            timeLeft = restDuration;
            document.getElementById("status").textContent = "Rest Time";
            breakSound.play();
        }
    }
    else{
        isWorkTime = true;
        timeLeft = workDuration;
        document.getElementById("status").textContent = "Focus Time";
        document.getElementById("cycleCount").textContent = `Cycles completed: ${count}`;
        workSound.play();
    }
}

//-----Button Logic----------------------------------------------------------------------------------

//Stop the interval, but do not reset the timer.
function pauseTimer() {
    clearInterval(timer);
    timer = null;
    document.getElementById("status").textContent = "Paused";
    isPaused = true;
    startBtn.textContent = "Resume";
}

//Clear the interval and reset the timer to the appropriate duration.
function resetTimer(){
    pauseTimer();
    timeLeft = workDuration;
    updateTimerDisplay();
}

//-----UI Functions-----------------------------------------------------------------------------------

//Show/Hide Settings Panel
function showPanel() {
    if (panel.style.transform === 'translateX(0px)') {
        panel.style.transform = 'translateX(-220px)';
        tab.textContent = '>';
    }
    else {
        panel.style.transform = 'translateX(0px)';
        tab.textContent = '<';
    }
}

//-----Event Listeners--------------------------------------------------------------------------------
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
tab.addEventListener("click", showPanel);