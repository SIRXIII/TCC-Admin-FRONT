// src/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make sure Pusher is available globally
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY, // Reverb app key from your .env
    wsHost: import.meta.env.VITE_REVERB_HOST, // Reverb host from your .env
    wsPort: import.meta.env.VITE_REVERB_PORT, // Reverb port from your .env
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

export default echo;
