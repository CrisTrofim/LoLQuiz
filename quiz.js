let quizData = [];
let currentIndex = 0;
let score = 0;
let timer = 30 * 60; // 30 minutes
let questionLimit = 169;
let totalAnswers = 0;
let finalScoreShown = false;
let isHardMode = false;

// --- Logique du Menu ---
function toggleMenu() {
    const menu = document.getElementById("side-menu");
    if (menu.style.width === "250px") {
        menu.style.width = "0";
    } else {
        menu.style.width = "250px";
    }
}

// Charger les données du quiz
fetch("quiz_data.json")
    .then(response => response.json())
    .then(data => {
        quizData = data;
        shuffleArray(quizData);
    })
    .catch(err => console.error("Erreur lors du chargement du JSON:", err));

function startQuiz() {
    const numInput = document.getElementById("numQuestions");
    questionLimit = parseInt(numInput.value, 10);

    // Écouteur pour la touche Entrée
    const inputField = document.getElementById("championInput");
    inputField.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    if (isNaN(questionLimit) || questionLimit < 1 || questionLimit > 169) {
        alert("Veuillez entrer un nombre valide entre 1 et 169.");
        return;
    }

    // Gestion de l'affichage (Transition vers le jeu)
    document.getElementById("settings-box").style.display = "none";
    document.getElementById("stats-display").style.display = "flex";
    document.querySelector(".question-container").style.display = "block";
    document.querySelector(".input-group").style.display = "flex";
    document.getElementById("hard-mode-btn").style.display = "block";

    // Reset du Quiz
    score = 0;
    currentIndex = 0;
    totalAnswers = 0;
    finalScoreShown = false;
    document.getElementById("score").textContent = `Score: 0/${questionLimit}`;
    
    displayNextQuestion();
    startTimer();
}

function displayNextQuestion() {
    if (currentIndex < questionLimit) {
        const currentQuestion = quizData[currentIndex];
        document.getElementById("description").textContent = currentQuestion.description;

        const imgElement = document.getElementById("ultimateImage");
        if (isHardMode) {
            imgElement.style.display = "none";
        } else {
            imgElement.src = currentQuestion.image;
            imgElement.style.display = "block";
        }

        document.getElementById("feedback").textContent = '';
    } else {
        endQuiz();
    }
}

function checkAnswer() {
    const inputField = document.getElementById("championInput");
    const userInput = inputField.value.trim().toLowerCase();
    
    // Sécurité si on clique trop vite
    if (currentIndex >= questionLimit) return;

    const correctAnswer = quizData[currentIndex].name.toLowerCase();
    const feedbackElement = document.getElementById("feedback");

    if (userInput === correctAnswer) {
        score++;
        feedbackElement.textContent = "Correct !";
        feedbackElement.style.color = "#4caf50";
    } else {
        feedbackElement.textContent = `Faux ! C'était : ${quizData[currentIndex].name}`;
        feedbackElement.style.color = "#ff5252";
    }

    document.getElementById("score").textContent = `Score: ${score}/${questionLimit}`;
    
    // Bloquer l'input pendant le feedback pour éviter le spam
    inputField.disabled = true;

    setTimeout(() => {
        currentIndex++;
        totalAnswers++;
        inputField.value = "";
        inputField.disabled = false;
        inputField.focus();
        displayNextQuestion();
    }, 1200);
}

function toggleHardMode() {
    isHardMode = !isHardMode;
    const btn = document.getElementById("hard-mode-btn");
    btn.textContent = isHardMode ? "Disable Hard Mode" : "Enable Hard Mode";
    displayNextQuestion();
}

function endQuiz() {
    const questionContainer = document.querySelector(".question-container");
    
    // Cacher les éléments de question
    document.getElementById("description").style.display = "none";
    document.getElementById("ultimateImage").style.display = "none";
    document.getElementById("feedback").style.display = "none";

    const completionMessage = document.getElementById("quiz-completed");
    completionMessage.style.display = "block";

    // Message spécial 100%
    if (score === questionLimit && questionLimit > 0) {
        completionMessage.innerHTML = `
            <p style="color: #4caf50; font-size: 24px;">Perfect Score! Touch grass now!</p>
            <img src="https://media.tenor.com/CW-0A0q-6ksAAAAM/touching-grass.gif" alt="Grass" style="width: 200px; margin-top: 20px; border-radius: 10px;">
        `;
    }

    document.querySelector(".input-group").style.display = "none";
    document.getElementById("hard-mode-btn").style.display = "none";
    document.getElementById("restart-btn").style.display = "inline-block";
    document.getElementById("stats-display").style.display = "none";

    if (!finalScoreShown) {
        showFinalScore();
    }
}

function showFinalScore() {
    const finalScoreElement = document.getElementById("final-score");
    finalScoreElement.style.display = "block";
    finalScoreElement.innerHTML = `Résultat Final : <span style="color:#c4b998">${score} / ${questionLimit}</span>`;
    finalScoreShown = true;
}

function startTimer() {
    const timerElement = document.getElementById("timer");
    let remainingTime = timer;
    
    const interval = setInterval(() => {
        if (remainingTime <= 0 || totalAnswers >= questionLimit) {
            clearInterval(interval);
            if (!finalScoreShown && totalAnswers >= questionLimit) endQuiz();
        } else {
            remainingTime--;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            timerElement.textContent = `Temps: ${minutes}:${seconds.toString().padStart(2, "0")}`;
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