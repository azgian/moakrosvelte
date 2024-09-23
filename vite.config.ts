import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
// import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		// SvelteKitPWA({
		// 	registerType: 'autoUpdate',
		// 	manifest: {
		// 		name: '모악로',
		// 		short_name: '모악로',
		// 		description: '모악로 애플리케이션',
		// 		theme_color: '#ffffff',
		// 		icons: [
		// 			{
		// 				src: 'images/logo192.png',
		// 				sizes: '192x192',
		// 				type: 'image/png'
		// 			},
		// 			{
		// 				src: 'images/logo512.png',
		// 				sizes: '512x512',
		// 				type: 'image/png'
		// 			}
		// 		]
		// 	},
		// 	workbox: {
		// 		globPatterns: ['**/*.{js,css,html,ico,png,svg}']
		// 	}
		// })
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
