const generalSymbols = '=+-_()*&&!@:"{}[]/?.';
const generalHomeRow = "asdfjkl;";
const rightHandSymbols = "()p_-=+[{]}\"';:?/";
const rightHandHomeRow = "l;";
const numericalSymbols = "1234567890!@#$%^&*()";
const numericalHomerow = "asdfghjkl;";

let currentSetSymbols = generalSymbols;
let currentSetHomeRow = generalHomeRow;

let alternateFlag = true; // true = symbols, false = home row
let correctCount = 0;
let characterCount = 0;
let currentIndex = 0;
let last20Attempts = [];

function getRandomCharacter(set) {
  const randomIndex = Math.floor(Math.random() * set.length);
  return set[randomIndex];
}

function updateSymbol() {
  const symbolDiv = document.getElementById("symbol");
  symbolDiv.style.opacity = 0; // Briefly hide the symbol

  setTimeout(() => {
    const setToUse = alternateFlag
      ? currentSetSymbols
      : currentSetHomeRow;
    currentIndex = getRandomCharacter(setToUse);
    symbolDiv.innerText = currentIndex;
    symbolDiv.style.opacity = 1; // Show the symbol again
    document.getElementById("inputBox").value = "";
    document.getElementById("errorMessage").innerText =
      "Feedback will appear here";
    document.getElementById("errorMessage").style.color = "white";
  }, 300); // Adjust timing as needed
}

function updateStats() {
  const correctAttempts = last20Attempts.filter(
    (attempt) => attempt === true
  ).length;
  const totalAttempts = last20Attempts.length;
  const ratio =
    totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
  document.getElementById(
    "stats"
  ).innerText = `Total Correct: ${correctCount}`;
  // document.getElementById(
  //   "stats2"
  // ).innerText = `Right/Wrong Ratio (Last 20): ${ratio.toFixed(2)}%`;

  const stats2Div = document.getElementById("stats2");
  stats2Div.innerText = `Right/Wrong Ratio (Last 20): ${ratio.toFixed(
    2
  )}%`;

  // Change color based on ratio
  if (ratio == 0) {
    stats2Div.style.color = "rgb(256, 256, 256)";
  } else if (ratio < 60) {
    stats2Div.style.color = "rgb(255, 115, 115)";
  } else if (ratio >= 60 && ratio <= 80) {
    stats2Div.style.color = "rgb(255, 226, 110)";
  } else {
    stats2Div.style.color = "rgb(114, 237, 124)";
  }
}

function trackAttempt(success) {
  last20Attempts.push(success);
  if (last20Attempts.length > 20) {
    last20Attempts.shift(); // Keep only the last 20 attempts
  }
  updateStats();
}

document
  .getElementById("inputBox")
  .addEventListener("input", function () {
    const input = this.value;
    const currentSymbol = document.getElementById("symbol").innerText;

    if (input === currentSymbol) {
      correctCount++;
      characterCount++;
      trackAttempt(true);
      alternateFlag = !alternateFlag;
      this.style.backgroundColor = "rgb(114, 237, 124)"; // Flash green
      setTimeout(() => {
        this.style.backgroundColor = "white"; // Reset color
      }, 100); // Adjust timing as needed
      updateSymbol();
    } else {
      this.value = ""; // Clear input field on incorrect input
      document.getElementById(
        "errorMessage"
      ).innerText = `Input character was: ${input}`;
      document.getElementById("errorMessage").style.color =
        "rgb(255, 75, 75)";
      trackAttempt(false);
    }
  });

  function switchMode(mode) {
    resetStats(); // Reset stats on mode change
    if (mode === "general") {
      currentSetSymbols = generalSymbols;
      currentSetHomeRow = generalHomeRow;
      document.getElementById("rightHand").style.fontWeight = "400";
      document.getElementById("general").style.fontWeight = "700";
      document.getElementById("numerical").style.fontWeight = "400"; // Reset weight for numerical
    } else if (mode === "rightHand") {
      currentSetSymbols = rightHandSymbols;
      currentSetHomeRow = rightHandHomeRow;
      document.getElementById("general").style.fontWeight = "400";
      document.getElementById("rightHand").style.fontWeight = "700";
      document.getElementById("numerical").style.fontWeight = "400"; // Reset weight for numerical
    } else if (mode === "numerical") {  // New mode added
      currentSetSymbols = numericalSymbols;
      currentSetHomeRow = numericalHomerow;
      document.getElementById("general").style.fontWeight = "400";
      document.getElementById("rightHand").style.fontWeight = "400";
      document.getElementById("numerical").style.fontWeight = "700";
    } else if (mode === 'custom') {
      document.getElementById("general").style.fontWeight = "400";
      document.getElementById("rightHand").style.fontWeight = "400";
      document.getElementById("numerical").style.fontWeight = "400";
      document.getElementById("customMode").style.fontWeight = "700";
    }
    updateSymbol(); // Start with the new mode
  }

function resetStats() {
  correctCount = 0;
  characterCount = 0;
  last20Attempts = [];
  updateStats();
}

document
  .getElementById("clearButton")
  .addEventListener("click", function () {
    document.getElementById("inputBox2").value = "";
  });

// Initialize with the first symbol
updateSymbol();

let timerInterval;
let timeLeft = 60;
let timedMode = false;
let timerStarted = false; // Flag to check if the timer has started

function toggleTimedMode() {
  timedMode = !timedMode;
  const timedModeButton = document.getElementById("timedMode");

  if (timedMode) {
    timedModeButton.innerText = "Timed Mode (60)";
    resetStats(); // Reset stats when starting timed mode
    timeLeft = 60; // Reset time left
    timerStarted = false; // Reset timerStarted flag
  } else {
    timedModeButton.innerText = "Timed Mode (Off)";
    clearInterval(timerInterval); // Stop the timer
    timeLeft = 60; // Reset time left
    timerStarted = false; // Reset timerStarted flag
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById(
      "timedMode"
    ).innerText = `Timed Mode (${timeLeft})`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time's up!");
      toggleTimedMode(); // Turn off timed mode
    }
  }, 1000);
}

document
  .getElementById("inputBox")
  .addEventListener("input", function () {
    // ... (your existing input event listener code) ...

    if (timedMode && !timerStarted) {
      startTimer();
      timerStarted = true;
    }
  });

  const customModeButton = document.getElementById('customMode');
const customDialog = document.getElementById('customDialog');
const createCustomModeButton = document.getElementById('createCustomMode');
const cancelCustomModeButton = document.getElementById('cancelCustomMode');
const homeKeysInput = document.getElementById('homeKeys');
const charKeysInput = document.getElementById('charKeys');

function openModal() {
  customDialog.showModal();
}

cancelCustomModeButton.addEventListener('click', () => {
  customDialog.close();
});

createCustomModeButton.addEventListener('click', () => {
  const homeKeys = homeKeysInput.value;
  const charKeys = charKeysInput.value;

  if (homeKeys && charKeys) {
    currentSetSymbols = charKeys;
    currentSetHomeRow = homeKeys;
    resetStats();
    switchMode('custom'); // Activate custom mode
    customDialog.close();
  } else {
    // Handle case where input fields are empty (e.g., show an error message)
    alert("Please fill in both fields.");
  }
});