let selectedSlot = null;
let allChampions = [];

// 1. Charger les champions depuis le nouveau JSON
fetch("champions_data.json")
    .then(res => res.json())
    .then(data => {
        allChampions = data.sort((a, b) => a.name.localeCompare(b.name));
        renderChampionGrid(allChampions);
    })
    .catch(err => console.error("Erreur chargement champions:", err));

// 2. Fonction pour afficher la grille (utilisée aussi pour le filtrage)
function renderChampionGrid(champions) {
    const grid = document.getElementById('championGrid');
    grid.innerHTML = ""; // Vide la grille

    champions.forEach(champ => {
        const img = document.createElement('img');
        img.src = champ.icon; 
        img.className = 'champ-icon';
        img.title = champ.name;
        img.dataset.name = champ.name.toLowerCase();
        
        img.onclick = () => assignChampion(champ);
        grid.appendChild(img);
    });
}

// 3. Sélectionner un emplacement (Pick ou Ban)
function selectSlot(el) {
    // Nettoyage des sélections précédentes
    document.querySelectorAll('.pick-slot, .ban-slot').forEach(s => s.classList.remove('active'));
    
    selectedSlot = el;
    el.classList.add('active');
}

// 4. Assigner le champion au slot sélectionné
function assignChampion(champ) {
    if (!selectedSlot) {
        alert("Sélectionnez d'abord un emplacement (Bleu ou Rouge) !");
        return;
    }

    // On applique l'image en fond
    selectedSlot.style.backgroundImage = `url(${champ.icon})`;
    
    // Si c'est un pick, on peut masquer le texte du rôle
    const roleText = selectedSlot.querySelector('.role-icon');
    if (roleText) roleText.style.opacity = "0.3";

    // Désélection
    selectedSlot.classList.remove('active');
    selectedSlot = null;
}

// 5. Fonction de recherche (appelée par le oninput dans le HTML)
function filterChampions() {
    const searchTerm = document.getElementById('searchChamp').value.toLowerCase();
    const filtered = allChampions.filter(champ => 
        champ.name.toLowerCase().includes(searchTerm)
    );
    renderChampionGrid(filtered);
}

function toggleMenu() {
    const menu = document.getElementById("side-menu");
    menu.style.width = (menu.style.width === "250px") ? "0" : "250px";
}