import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		fs: {
			allow: ['.'],
		},
	},
	build: {
		// Ensure assets are properly referenced
		assetsDir: '_assets',
		rollupOptions: {
			output: {
				manualChunks: undefined,
			},
		},
	},
})
