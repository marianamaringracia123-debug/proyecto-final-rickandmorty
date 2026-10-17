// ==========================================
// 1. FIRMA DEL DESARROLLADOR Y CONFIGURACIÓN
// ==========================================
const developerName = "Mariana Marín Gracia";
const developerId = "66758";
const baseUrl = "https://rickandmortyapi.com/api";

let favoritesArray = [];

// ==========================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const btnCharacters = document.getElementById('btnCharacters');
const btnLocations = document.getElementById('btnLocations');
const btnEpisodes = document.getElementById('btnEpisodes');
const btnFavorites = document.getElementById('btnFavorites');

const dataContainer = document.getElementById('dataContainer');
const mainFooter = document.getElementById('mainFooter');

// ==========================================
// 3. INYECCIÓN DEL FOOTER Y RECURSOS INICIALES
// ==========================================
if (mainFooter) {
    mainFooter.innerHTML = `<p>Developed with 💻 by <strong>${developerName}</strong> (ID: ${developerId}) | Rick and Morty Portal</p>`;
}

// Cargar favoritos guardados en LocalStorage
const previousFavs = localStorage.getItem('myFavCharacters');
if (previousFavs) {
    try {
        favoritesArray = JSON.parse(previousFavs);
    } catch (e) {
        favoritesArray = [];
    }
}

// ==========================================
// 4. FUNCIÓN ASÍNCRONA GENÉRICA (FETCH)
// ==========================================
async function fetchData(endpoint) {
    try {
        dataContainer.innerHTML = '<p class="loading-text">⚡ Abriendo portal interdimensional...</p>';
        const response = await fetch(`${baseUrl}${endpoint}`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error al obtener datos:", error);
        dataContainer.innerHTML = '<p class="loading-text" style="color: var(--danger);">❌ Error de conexión con el multiverso.</p>';
        return [];
    }
}

// ==========================================
// 5. FUNCIONES DE RENDERIZADO
// ==========================================

// --- Personajes ---
async function renderCharacters() {
    const characters = await fetchData('/character');
    dataContainer.innerHTML = '';

    if (!characters.length) {
        dataContainer.innerHTML = '<p class="loading-text">No se encontraron personajes.</p>';
        return;
    }

    characters.forEach(character => {
        const statusColor = character.status === 'Alive' ? 'var(--accent-cyan)' : (character.status === 'Dead' ? 'var(--danger)' : 'var(--text-muted)');
        const isFav = favoritesArray.some(f => f.name === character.name);

        const card = document.createElement('article');
        card.className = 'data-card';
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <div class="card-info">
                <h2>${character.name}</h2>
                <p class="info-label">Estado: <span style="color: ${statusColor}; font-weight: bold;">${character.status}</span></p>
                <p class="info-label">Especie: <span>${character.species}</span></p>
                <p class="info-label">Origen: <span>${character.origin.name}</span></p>
                <button class="${isFav ? 'btn-remove-fav' : 'btn-add-fav'}" onclick="toggleFavorite('${character.name.replace(/'/g, "\\'")}', '${character.image}')">
                    ${isFav ? '🗑️ Quitar de Favoritos' : '⭐ Agregar a Favoritos'}
                </button>
            </div>
        `;
        dataContainer.appendChild(card);
    });
}

// --- Ubicaciones ---
async function renderLocations() {
    const locations = await fetchData('/location');
    dataContainer.innerHTML = '';

    if (!locations.length) {
        dataContainer.innerHTML = '<p class="loading-text">No se encontraron ubicaciones.</p>';
        return;
    }

    locations.forEach(loc => {
        const card = document.createElement('article');
        card.className = 'data-card';
        card.innerHTML = `
            <div class="card-info">
                <h2>🌍 ${loc.name}</h2>
                <p class="info-label">Tipo: <span style="color: #fff;">${loc.type}</span></p>
                <p class="info-label">Dimensión: <span style="color: var(--accent-cyan);">${loc.dimension}</span></p>
                <p class="info-label">Residentes: <span>${loc.residents.length}</span></p>
            </div>
        `;
        dataContainer.appendChild(card);
    });
}

// --- Episodios ---
async function renderEpisodes() {
    const episodes = await fetchData('/episode');
    dataContainer.innerHTML = '';

    if (!episodes.length) {
        dataContainer.innerHTML = '<p class="loading-text">No se encontraron episodios.</p>';
        return;
    }

    episodes.forEach(ep => {
        const card = document.createElement('article');
        card.className = 'data-card';
        card.innerHTML = `
            <div class="card-info">
                <h2>📺 ${ep.name}</h2>
                <p class="info-label">Código: <span style="color: var(--accent-cyan); font-weight: bold;">${ep.episode}</span></p>
                <p class="info-label">Estreno: <span>${ep.air_date}</span></p>
            </div>
        `;
        dataContainer.appendChild(card);
    });
}

// --- Favoritos ---
function renderFavorites() {
    dataContainer.innerHTML = '';

    if (favoritesArray.length === 0) {
        dataContainer.innerHTML = '<p class="loading-text">Aún no has guardado favoritos en esta dimensión. ⭐</p>';
        return;
    }

    favoritesArray.forEach(fav => {
        const card = document.createElement('article');
        card.className = 'data-card';
        card.innerHTML = `
            <img src="${fav.image}" alt="${fav.name}">
            <div class="card-info">
                <h2>⭐ ${fav.name}</h2>
                <button class="btn-remove-fav" onclick="toggleFavorite('${fav.name.replace(/'/g, "\\'")}', '${fav.image}')">
                    🗑️ Quitar de Favoritos
                </button>
            </div>
        `;
        dataContainer.appendChild(card);
    });
}

// ==========================================
// 6. LÓGICA DE FAVORITOS
// ==========================================
function toggleFavorite(name, image) {
    const index = favoritesArray.findIndex(fav => fav.name === name);

    if (index > -1) {
        favoritesArray.splice(index, 1);
    } else {
        favoritesArray.push({ name, image });
    }

    localStorage.setItem('myFavCharacters', JSON.stringify(favoritesArray));

    if (btnFavorites.classList.contains('active')) {
        renderFavorites();
    } else if (btnCharacters.classList.contains('active')) {
        renderCharacters();
    }
}

// ==========================================
// 7. MANEJO DE EVENTOS Y NAVEGACIÓN DE BOTONES
// ==========================================
function setActiveButton(activeBtn) {
    [btnCharacters, btnLocations, btnEpisodes, btnFavorites].forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');
}

if (btnCharacters) {
    btnCharacters.addEventListener('click', () => {
        setActiveButton(btnCharacters);
        renderCharacters();
    });
}

if (btnLocations) {
    btnLocations.addEventListener('click', () => {
        setActiveButton(btnLocations);
        renderLocations();
    });
}

if (btnEpisodes) {
    btnEpisodes.addEventListener('click', () => {
        setActiveButton(btnEpisodes);
        renderEpisodes();
    });
}

if (btnFavorites) {
    btnFavorites.addEventListener('click', () => {
        setActiveButton(btnFavorites);
        renderFavorites();
    });
}

// ==========================================
// 8. INICIO AUTOMÁTICO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if (btnCharacters) {
        btnCharacters.click();
    }
});