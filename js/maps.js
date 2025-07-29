// Inicializa o mapa centralizado no Recife
const map = L.map('map').setView([-8.0476, -34.8770], 13); // Latitude e longitude do Recife, zoom 13

// Adiciona o mapa base do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

