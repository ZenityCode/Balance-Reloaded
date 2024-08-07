// App-Start
document.addEventListener('DOMContentLoaded', () => {
    // Zeige den Splash Screen und wechsle zur Login-Seite nach 2 Sekunden
    setTimeout(() => {
        document.getElementById('splash-screen').classList.add('hidden');
        document.getElementById('login-page').classList.remove('hidden');
    }, 2000);
});

// Benutzerdaten laden
let users = [];
fetch('data/users.json')
    .then(response => response.json())
    .then(data => {
        users = data.users;
    })
    .catch(error => console.error('Fehler beim Laden der Benutzerdaten:', error));

// Motivationssprüche laden
let quotes = [];
fetch('data/quotes.json')
    .then(response => response.json())
    .then(data => {
        quotes = data.quotes;
    })
    .catch(error => console.error('Fehler beim Laden der Zitate:', error));

// Zeige das PIN-Eingabefeld basierend auf der Auswahl
function showPinInput(selectedUser) {
    document.getElementById('pin-input').classList.remove('hidden');
    document.getElementById('pin').setAttribute('data-user', selectedUser);
}

// Überprüfe den PIN und begrüße den Benutzer
function login() {
    const pin = document.getElementById('pin').value;
    const userName = document.getElementById('pin').getAttribute('data-user');

    // Benutzer finden
    const user = users.find(u => u.name === userName);

    if (user && user.pin === pin) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('home-page').classList.remove('hidden');
        document.getElementById('greeting').textContent = `Willkommen, ${user.name}!`;

        // Zufälligen Motivationsspruch anzeigen
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('quote').textContent = randomQuote;

        // Anmeldedaten speichern
        const loginData = {
            date: new Date().toLocaleString(), // aktuelles Datum und Uhrzeit
            device: getDeviceInfo()
        };

        saveLoginData(user.name, loginData);
    } else {
        alert('Falscher PIN. Bitte versuche es erneut.');
    }
}

// Funktion, um Gerätedaten zu erhalten
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let device = "Unbekanntes Gerät";

    if (/Mobi|Android/i.test(userAgent)) {
        device = "Mobilgerät";
    } else if (/iPad|Tablet/i.test(userAgent)) {
        device = "Tablet";
    } else {
        device = "Desktop";
    }

    return `${device} (${userAgent})`;
}

// Anmeldedaten speichern
function saveLoginData(userName, loginData) {
    const existingData = JSON.parse(localStorage.getItem('loginData')) || {};
    
    // Wenn keine Daten vorhanden sind, für jeden Benutzer ein leeres Array initialisieren
    if (!existingData[userName]) {
        existingData[userName] = [];
    }

    // Neue Anmeldedaten hinzufügen
    existingData[userName].push(loginData);

    // Speichern der Daten im LocalStorage
    localStorage.setItem('loginData', JSON.stringify(existingData));
}

// Anmeldedaten anzeigen und in der App rendern
function showLoginData(userName) {
    const existingData = JSON.parse(localStorage.getItem('loginData')) || {};
    const loginHistoryDiv = document.getElementById('login-history');
    loginHistoryDiv.innerHTML = ""; // Leeren des vorhandenen Inhalts
    
    if (existingData[userName]) {
        existingData[userName].forEach((data, index) => {
            const dataEntry = document.createElement('p');
            dataEntry.textContent = `Anmeldung ${index + 1}: Datum: ${data.date}, Gerät: ${data.device}`;
            loginHistoryDiv.appendChild(dataEntry);
        });
        loginHistoryDiv.classList.remove('hidden');
    } else {
        loginHistoryDiv.textContent = `Keine Anmeldedaten für ${userName} vorhanden.`;
        loginHistoryDiv.classList.remove('hidden');
    }
}

// Registrierung des Service Workers für Offline-Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Balance-Reloaded/service-worker.js')
        .then(registration => {
            console.log('Service Worker registriert mit Scope:', registration.scope);
        })
        .catch(err => {
            console.error('Service Worker Registrierung fehlgeschlagen:', err);
        });
    });
}