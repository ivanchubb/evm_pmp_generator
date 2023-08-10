// evm_practice.js
let currentBAC, currentEV, currentAC, currentPV;
let streakCount = 0;
let timerInterval;

function generateProblem() {
    clearResponses(); // Clearing the inputs after checking the answers
    
    currentBAC = Math.floor(Math.random() * 1000) + 100;
    currentEV = Math.floor(Math.random() * currentBAC);
    currentAC = Math.floor(Math.random() * currentBAC);
    currentPV = Math.floor(Math.random() * currentBAC);

    document.getElementById('bac').textContent = currentBAC;
    document.getElementById('ev').textContent = currentEV;
    document.getElementById('ac').textContent = currentAC;
    document.getElementById('pv').textContent = currentPV;
}

function checkAnswers() {
    const cv = (currentEV - currentAC).toFixed(2);
    const sv = (currentEV - currentPV).toFixed(2);
    const cpi = (currentEV / currentAC).toFixed(2);
    const spi = (currentEV / currentPV).toFixed(2);
    const tcpi = ((currentBAC - currentEV) / (currentBAC - currentAC)).toFixed(2); // TCPI formula adjusted for absence of EAC

    const userCV = parseFloat(document.getElementById('cvInput').value).toFixed(2);
    const userSV = parseFloat(document.getElementById('svInput').value).toFixed(2);
    const userCPI = parseFloat(document.getElementById('cpiInput').value).toFixed(2);
    const userSPI = parseFloat(document.getElementById('spiInput').value).toFixed(2);
    const userTCPI = parseFloat(document.getElementById('tcpiInput').value).toFixed(2);

    // Checking each answer and setting input box colors accordingly
    colorizeInput('cvInput', userCV, cv);
    colorizeInput('svInput', userSV, sv);
    colorizeInput('cpiInput', userCPI, cpi);
    colorizeInput('spiInput', userSPI, spi);
    colorizeInput('tcpiInput', userTCPI, tcpi);
    
    // If all answers are correct, increment the streak
    if (allCorrect([userCV, userSV, userCPI, userSPI, userTCPI], [cv, sv, cpi, spi, tcpi])) {
        streakCount++;
    } else {
        streakCount = 0;
    }

    document.getElementById('streak').textContent = streakCount;
}

function clearResponses() {
    const inputIds = ['cvInput', 'svInput', 'cpiInput', 'spiInput', 'tcpiInput'];
    inputIds.forEach(id => {
        const inputElem = document.getElementById(id);
        inputElem.value = '';
        inputElem.style.borderColor = '';  // Reset to default
        inputElem.style.backgroundColor = '';  // Reset to default
    });
}



function colorizeInput(inputId, userValue, correctValue) {
    const inputElem = document.getElementById(inputId);
    if (userValue === correctValue) {
        inputElem.style.borderColor = "green";
        inputElem.style.backgroundColor = "#e6ffe6"; // light green background
    } else {
        inputElem.style.borderColor = "red";
        inputElem.style.backgroundColor = "#ffe6e6"; // light red background
    }
}

function allCorrect(userValues, correctValues) {
    for(let i = 0; i < userValues.length; i++) {
        if(userValues[i] !== correctValues[i]) {
            return false;
        }
    }
    return true;
}


function startTimer() {
    const duration = document.getElementById('timerInput').value;
    let timeRemaining = duration;

    document.getElementById('timeRemaining').textContent = timeRemaining;

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timeRemaining').textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Time is up!');
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('timeRemaining').textContent = '0';
}

function revealAnswers() {

    streakCount = 0;
    
    // Fetch the values from the input fields
    let BAC = parseFloat(document.getElementById("bac").textContent);
    let EV = parseFloat(document.getElementById("ev").textContent);
    let AC = parseFloat(document.getElementById("ac").textContent);
    let PV = parseFloat(document.getElementById("pv").textContent);

    // Check if all values are numbers before calculation
    if (isNaN(BAC) || isNaN(EV) || isNaN(AC) || isNaN(PV)) {
        alert("Please ensure that BAC, EV, AC, and PV values are generated.");
        return;
    }

    let CV = EV - AC;
    let SV = EV - PV;
    let CPI = EV / AC;
    let SPI = EV / PV;
    let TCPI = (BAC - EV) / (BAC - AC);

    // Set the answers in the input boxes
    document.getElementById("cvInput").value = CV.toFixed(2);
    document.getElementById("svInput").value = SV.toFixed(2);
    document.getElementById("cpiInput").value = CPI.toFixed(2);
    document.getElementById("spiInput").value = SPI.toFixed(2);
    document.getElementById("tcpiInput").value = TCPI.toFixed(2);
}



// Automatically generate a problem on page load
window.onload = generateProblem;
