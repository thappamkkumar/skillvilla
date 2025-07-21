// vite.config.js

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
		react(),
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
    
  ],
	 
	//this is for run app on mobile and desktop both
 	server: {
			host: '192.168.31.225',  // Your local IP address
			port: 3000,               // Port number
		},
  
	/*build: {
    outDir: 'public/js', // Specify the output directory for the build
    emptyOutDir: true, // Empty the output directory before building
  },*/
 /* esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    loader: {
      '.js': 'jsx',
    },
  },*/
});
