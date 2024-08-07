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

    } else {
        alert('Falscher PIN. Bitte versuche es erneut.');
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
