import Echo from 'laravel-echo';
import Pusher from 'pusher-js'; 

window.Pusher = Pusher;

// Get JWT token (adjust to how your app stores it — localStorage, cookie, etc.)
//const token = sessionStorage.getItem('auth_token');

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],

    // ?? THIS PART IS CRITICAL FOR PRIVATE CHANNEL AUTH
  /*  authEndpoint: 'http://192.168.31.225:8000/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    },*/
});
