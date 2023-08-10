// evm_practice.js
let currentBAC, currentEV, currentAC, currentPV;
let streakCount = 0;
let budgetSelection = null;
let scheduleSelection = null;

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}


function generateProblem() {
    clearResponses(); // Clearing the inputs after checking the answers
    
    currentBAC = getRandomInt(1000) + 100;
    currentEV = getRandomInt(currentBAC);
    currentAC = getRandomInt(currentBAC);
    currentPV = getRandomInt(currentBAC);

    document.getElementById('bac').textContent = currentBAC;
    document.getElementById('ev').textContent = currentEV;
    document.getElementById('ac').textContent = currentAC;
    document.getElementById('pv').textContent = currentPV;
}

function detailedAnswers(cv, sv, cpi, spi, tcpi) {
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
}


function checkAnswers() {
    const cv = (currentEV - currentAC).toFixed(2);
    const sv = (currentEV - currentPV).toFixed(2);
    const cpi = (currentEV / currentAC).toFixed(2);
    const spi = (currentEV / currentPV).toFixed(2);
    const tcpi = ((currentBAC - currentEV) / (currentBAC - currentAC)).toFixed(2); // TCPI formula adjusted for absence of EAC

    if (isDetailedMode)
    {
        detailedAnswers(cv, sv, cpi, spi, tcpi)
    } else {
        simpleAnswer(cv, sv)
    }
    
    document.getElementById('streak').textContent = streakCount;
}

function clearResponses() {
    const inputIds = ['cvInput', 'svInput', 'cpiInput', 'spiInput', 'tcpiInput', 'overBudgetButton', 'underBudgetButton', 'onBudgetButton', 'aheadScheduleButton', 'behindScheduleButton', 'onScheduleButton'];
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


function revealAnswers() {

    streakCount = 0;
    document.getElementById('streak').textContent = streakCount;
    
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


    if (isDetailedMode) {

        // Set the answers in the input boxes
        document.getElementById("cvInput").value = CV.toFixed(2);
        document.getElementById("svInput").value = SV.toFixed(2);
        document.getElementById("cpiInput").value = CPI.toFixed(2);
        document.getElementById("spiInput").value = SPI.toFixed(2);
        document.getElementById("tcpiInput").value = TCPI.toFixed(2);
    }
    else {
        conditions = {
            'overBudget': CV < 0,
            'underBudget': CV > 0,
            'onBudget': CV == 0
        }
        checkCondition("overBudget", conditions)
        checkCondition("underBudget", conditions)
        checkCondition("onBudget", conditions)
        
        conditions = {
            'aheadSchedule': SV > 0,
            'behindSchedule': SV < 0,
            'onSchedule': SV == 0
        }
        checkCondition("aheadSchedule", conditions)
        checkCondition("behindSchedule", conditions)
        checkCondition("onSchedule", conditions)
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // This ensures that the script runs after the HTML is loaded.
    updateMode();
});

function toggleMode() {
    updateMode();
}

function updateMode() {
    const toggleCheckbox = document.getElementById('modeToggle');
    const detailedAnswers = document.getElementById('detailedAnswers');
    const simpleAnswers = document.getElementById('simpleAnswers');

    if (toggleCheckbox.checked) {
        detailedAnswers.style.display = "none";
        simpleAnswers.style.display = "block";
        isDetailedMode = false;
    } else {
        detailedAnswers.style.display = "block";
        simpleAnswers.style.display = "none";
        isDetailedMode = true;
    }
}

function simpleAnswer(cv, sv) {
    let correctAnswer = true;

    correctAnswer &= checkCondition(budgetSelection, {
        'overBudget': cv < 0,
        'underBudget': cv > 0,
        'onBudget': cv == 0
    });

    correctAnswer &= checkCondition(scheduleSelection, {
        'aheadSchedule': sv > 0,
        'behindSchedule': sv < 0,
        'onSchedule': sv == 0
    });

    if (correctAnswer) {
        streakCount++;
    } else {
        streakCount = 0;
    }
}

function checkCondition(selection, conditions) {
    const buttonId = {
        'overBudget': 'overBudgetButton',
        'underBudget': 'underBudgetButton',
        'onBudget': 'onBudgetButton',
        'aheadSchedule': 'aheadScheduleButton',
        'behindSchedule': 'behindScheduleButton',
        'onSchedule': 'onScheduleButton'
    };

    if (conditions[selection] === true) {
        styleButton(buttonId[selection], 'green', '#e6ffe6');
        return true;
    } else {
        styleButton(buttonId[selection], 'red', '#ffe6e6');
        return false;
    }
}

function styleButton(buttonId, borderColor, backgroundColor) {
    const element = document.getElementById(buttonId);
    element.style.borderColor = borderColor;
    element.style.backgroundColor = backgroundColor;
}

// Automatically generate a problem on page load
window.onload = generateProblem;
