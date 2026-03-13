async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!city) {
        alert("Por favor, escribe una ciudad.");
        return;
    }

    try {
        // PASO 1: Obtener coordenadas con Nominatim
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            resultsDiv.innerHTML = "<p>Ciudad no encontrada.</p>";
            return;
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        // PASO 2: Obtener el clima con Open-Meteo
        // Pedimos temperatura a 2m y probabilidad de lluvia
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_probability_max&timezone=auto`);
        const weatherData = await weatherResponse.json();

        displayWeather(weatherData);

    } catch (error) {
        console.error("Error:", error);
        resultsDiv.innerHTML = "<p>Hubo un error al obtener los datos.</p>";
    }
}

function displayWeather(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ""; // Limpiar resultados anteriores

    // Recorremos los primeros 6 días
    for (let i = 0; i < 6; i++) {
        const date = data.daily.time[i];
        const temp = data.daily.temperature_2m_max[i];
        const rain = data.daily.precipitation_probability_max[i];

        const card = `
            <div class="card">
                <h3>${date}</h3>
                <p><strong>Temp Máx:</strong> ${temp}°C</p>
                <p><strong>Lluvia:</strong> ${rain}%</p>
            </div>
        `;
        resultsDiv.innerHTML += card;
    }
}