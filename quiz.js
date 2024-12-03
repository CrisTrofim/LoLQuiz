let quizData = [];
let currentIndex = 0;
let score = 0;
let timer = 25 * 60; // 25 minutes en secondes
let totalQuestions = 0; // Variable pour stocker le nombre de champions

// Charger les données du quiz
fetch("quiz_data.json")
    .then(response => response.json())
    .then(data => {
        quizData = data;
        totalQuestions = quizData.length; // Calcul du total des champions
        displayNextQuestion();
        startTimer();
        // Mettre à jour le compteur total dans le HTML
        document.getElementById("score").textContent = `Score: ${score}/${totalQuestions}`;
    });

function displayNextQuestion() {
    if (currentIndex < quizData.length) {
        const currentQuestion = quizData[currentIndex];
        document.getElementById("description").textContent = currentQuestion.description;
        document.getElementById("ultimateImage").src = currentQuestion.image;
        document.getElementById("ultimateImage").style.display = "block"; // Afficher l'image
        document.getElementById("feedback").textContent = ''; // Réinitialiser le feedback
    } else {
        document.getElementById("description").textContent = "Quiz completed!";
        document.querySelector(".input-group").style.display = "none";
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
        feedbackElement.textContent = "Wrong!";
        feedbackElement.style.color = "red";
    }

    // Mettre à jour le score avec le total dynamique
    document.getElementById("score").textContent = `Score: ${score}/${totalQuestions}`;
    currentIndex++;
    document.getElementById("championInput").value = "";
    displayNextQuestion();
}

function startTimer() {
    const timerElement = document.getElementById("timer");
    const interval = setInterval(() => {
        if (timer <= 0) {
            clearInterval(interval);
            alert("Time's up! Final score: " + score);
            document.querySelector(".input-group").style.display = "none";
        } else {
            timer--;
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            timerElement.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
    }, 1000);
}
