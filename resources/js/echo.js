import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export function initEcho(token) {
    // ?? Disconnect previous Echo instance (if exists)
    if (window.Echo) {
        window.Echo.disconnect();
    }

    // ??? Common config
    const echoConfig = {
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    };

    // ?? Conditionally add auth only if token exists
    if (token && token.trim() !== '') {
        echoConfig.auth = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        //console.info('Echo initialized with auth.');
    } else {
       // console.info('Echo initialized without auth (public only).');
    }

    // ? Initialize Echo
    window.Echo = new Echo(echoConfig);
}
