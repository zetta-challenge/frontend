import containerQueries from '@tailwindcss/container-queries'
import forms from '@tailwindcss/forms'
import type { Config } from 'tailwindcss'

export default {
	darkMode: 'selector',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
	},
	plugins: [forms, containerQueries],
} satisfies Config
