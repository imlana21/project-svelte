import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'

export default defineConfig({
	plugins: [
		svelte({
			configFile: false
		})
	],
	test: {
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['./src/tests/setup.ts']
	},
	resolve: {
		conditions: ['browser', 'import', 'module', 'default'],
		alias: {
			'$lib': fileURLToPath(new URL('./src/lib', import.meta.url))
		}
	}
})
