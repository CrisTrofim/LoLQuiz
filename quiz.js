let quizData = [];
let currentIndex = 0;
let score = 0;
let timer = 25 * 60; // 25 minutes en secondes
let totalQuestions = 0; // Nombre total de champions dans le quiz
let totalAnswers = 0; // Nombre de réponses données (correctes ou non)
let interval; // Déclare l'intervalle pour pouvoir le nettoyer
let questionLimit = 169; // Modifier ce nombre pour tester avec moins de questions
let finalScoreShown = false;
let isHardMode = false;

// Charger les données du quiz
fetch("quiz_data.json")
    .then(response => response.json())
    .then(data => {
        quizData = data;
        shuffleArray(quizData);  // Mélange les questions de manière aléatoire
        totalQuestions = quizData.length; // Calcul du total des champions
        displayNextQuestion();
        startTimer();
        // Mettre à jour le compteur total dans le HTML
        document.getElementById("score").textContent = `Score: ${score}/${totalQuestions}`;
    });

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échange les éléments
    }
}

// Fonction pour activer/désactiver le Mode Hard
function toggleHardMode() {
    isHardMode = !isHardMode; // Inverser l'état du mode Hard

    // Mettre à jour le texte du bouton
    const hardModeBtn = document.getElementById("hard-mode-btn");
    if (isHardMode) {
        hardModeBtn.textContent = "Disable Hard Mode";
    } else {
        hardModeBtn.textContent = "Enable Hard Mode";
    }

    // Réafficher la prochaine question
    displayNextQuestion();
}

function displayNextQuestion() {
    if (currentIndex < questionLimit && totalAnswers < questionLimit) {
        const currentQuestion = quizData[currentIndex];
        document.getElementById("description").textContent = currentQuestion.description;

        // Cacher l'image si le mode Hard est activé
        if (isHardMode) {
            document.getElementById("ultimateImage").style.display = "none"; // Cacher l'image
        } else {
            document.getElementById("ultimateImage").src = currentQuestion.image;
            document.getElementById("ultimateImage").style.display = "block"; // Afficher l'image
        }

        document.getElementById("feedback").textContent = ''; // Réinitialiser le feedback
        document.getElementById("restart-btn").style.display = "none"; // Afficher le bouton
    } else {
        document.getElementById("description").textContent = "Quiz completed!";
        document.querySelector(".input-group").style.display = "none";
        document.getElementById("restart-btn").style.display = "block"; // Affiche le bouton
        if (!finalScoreShown) { // Vérifier si le score final a déjà été affiché
            showFinalScore();
            finalScoreShown = true; // Mettre à jour la variable pour indiquer que le score final a été affiché
        }
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

    // Mettre à jour le score avec le total dynamique
    document.getElementById("score").textContent = `Score: ${score}/${totalQuestions}`;

    // Ajouter un délai avant de passer à la question suivante pour afficher le feedback
    setTimeout(() => {
        currentIndex++;
        totalAnswers++; // Augmenter le nombre de réponses données
        document.getElementById("championInput").value = "";
        displayNextQuestion();
    }, 2000); // Afficher le feedback pendant 2 secondes avant de continuer
}

function startTimer() {
    const timerElement = document.getElementById("timer");
    interval = setInterval(() => {
        if (timer <= 0 || totalAnswers >= questionLimit) {
            clearInterval(interval);
            if (!finalScoreShown) { // Vérifier si le score final a déjà été affiché
                showFinalScore();
                finalScoreShown = true; // Mettre à jour la variable pour indiquer que le score final a été affiché
            }
        } else {
            timer--;
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            timerElement.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
    }, 1000);
}

function showFinalScore() {
    // Afficher le score final
    document.getElementById("final-score").textContent = `Final Score: ${score}/${questionLimit}`;
    document.getElementById("final-score").style.display = "block"; // Affiche le score final
    document.getElementById("restart-btn").style.display = "block"; // Affiche le bouton de redémarrage
    totalAnswers=2
    // Vérifier si le joueur a un score de 100%
    if (score === totalAnswers) {
        // Créer un élément image pour le gif
        const gifElement = document.createElement("img");
        gifElement.src = "https://media.tenor.com/CW-0A0q-6ksAAAAM/touching-grass.gif";
        gifElement.alt = "Touching Grass GIF";
        gifElement.style.display = "block";
        gifElement.style.marginTop = "20px"; // Ajouter un peu d'espace pour un meilleur rendu
        gifElement.id = "gif-grass"

        // Créer un élément texte pour le message
        const messageElement = document.createElement("p");
        messageElement.textContent = "Great! Now go touch grass!";
        messageElement.style.fontSize = "24px";
        messageElement.style.fontWeight = "bold";
        messageElement.style.color = "green";
        messageElement.style.textAlign = "center";
        messageElement.id = "message-grass"

        // Ajouter le gif et le message à la page
        document.body.appendChild(gifElement);
        document.body.appendChild(messageElement);
    }
}

function restartQuiz() {
    location.reload();  // Rafraîchit la page pour redémarrer le quiz
}


