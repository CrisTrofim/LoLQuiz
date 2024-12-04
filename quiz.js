let quizData = [];
let currentIndex = 0;
let score = 0;
let timer = 30 * 60; // 30 minutes in seconds
let questionLimit = 169; // Max number of questions
let totalAnswers = 0;
let finalScoreShown = false;
let isHardMode = false;

// Fetch quiz data
fetch("quiz_data.json")
    .then(response => response.json())
    .then(data => {
        quizData = data;
        shuffleArray(quizData);
    });

function startQuiz() {
    const numQuestions = document.getElementById("numQuestions").value;
    questionLimit = parseInt(numQuestions, 10);

    if (isNaN(questionLimit) || questionLimit < 1 || questionLimit > 169) {
        alert("Please enter a valid number between 1 and 169.");
        return;
    }

    // Hide settings and show quiz UI
    document.querySelector(".settings").style.display = "none";
    document.querySelector(".score-timer").style.display = "block";
    document.querySelector(".question-container").style.display = "flex";
    document.querySelector(".input-group").style.display = "flex";
    document.getElementById("hard-mode-btn").style.display = "block";

    // Reset and start the quiz
    score = 0;
    currentIndex = 0;
    totalAnswers = 0;
    document.getElementById("score").textContent = `Score: 0/${questionLimit}`;
    displayNextQuestion();
    startTimer();
}

function displayNextQuestion() {
    if (currentIndex < questionLimit) {
        const currentQuestion = quizData[currentIndex];
        document.getElementById("description").textContent = currentQuestion.description;

        if (isHardMode) {
            document.getElementById("ultimateImage").style.display = "none";
        } else {
            document.getElementById("ultimateImage").src = currentQuestion.image;
            document.getElementById("ultimateImage").style.display = "block";
        }

        document.getElementById("feedback").textContent = '';
    } else {
        endQuiz();
    }
}

function toggleHardMode() {
    isHardMode = !isHardMode;

    const hardModeButton = document.getElementById("hard-mode-btn");
    hardModeButton.textContent = isHardMode ? "Disable Hard Mode" : "Enable Hard Mode";

    // Mise à jour de l'affichage pour les questions actuelles
    displayNextQuestion();
}

function showFinalScore() {
    const finalScoreElement = document.getElementById("final-score");
    finalScoreElement.style.display = "block"; // Assurez-vous que l'élément est visible
    finalScoreElement.textContent = `Final Score: ${score} / ${questionLimit}`;
    finalScoreShown = true; // Marquer le score comme affiché
}

function endQuiz() {
    // Masquer tous les éléments enfants sauf #quiz-completed
    const questionContainer = document.querySelector(".question-container");
    Array.from(questionContainer.children).forEach(child => {
        if (child.id !== "quiz-completed") {
            child.style.display = "none";
        }
    });

    // Afficher le message "Quiz Completed"
    const completionMessage = document.getElementById("quiz-completed");
    completionMessage.style.display = "block";

    // Masquer les autres éléments de l'interface
    document.querySelector(".input-group").style.display = "none";
    document.getElementById("hard-mode-btn").style.display = "none";
    document.getElementById("restart-btn").style.display = "block";
    document.querySelector(".settings").style.display = "none";
    document.querySelector(".score-timer").style.display = "none";
    
    if (!finalScoreShown) {
        showFinalScore(); // Appeler la fonction pour afficher le score
    }
}


function checkAnswer() {
    const userInput = document.getElementById("championInput").value.trim().toLowerCase();
    const correctAnswer = quizData[currentIndex].name.toLowerCase();
    const feedbackElement = document.getElementById("feedback");

    if (userInput === correctAnswer) {
        score++;
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = `Wrong! The correct answer is: ${quizData[currentIndex].name}`;
        feedbackElement.style.color = "red";
    }

    document.getElementById("score").textContent = `Score: ${score}/${questionLimit}`;
    setTimeout(() => {
        currentIndex++;
        totalAnswers++;
        document.getElementById("championInput").value = "";
        displayNextQuestion();
    }, 2000);
}

function startTimer() {
    const timerElement = document.getElementById("timer");
    let remainingTime = timer;
    const interval = setInterval(() => {
        if (remainingTime <= 0 || totalAnswers >= questionLimit) {
            clearInterval(interval);
            if (!finalScoreShown) {
                showFinalScore();
            }
        } else {
            remainingTime--;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            timerElement.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
    }, 1000);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function restartQuiz() {
    location.reload();
}

