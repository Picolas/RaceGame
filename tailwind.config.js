/** @type {import('tailwindcss').Config} */
module.exports = {
	daisyui: {
		themes: [
			{
				exalt: {
					"primary": "#465EA8",
					"secondary": "#37358A",
					"accent": "#E8318A",
					"neutral": "#1a1a1a",
					"base-100": "#ffffff",
					"info": "#465EA8",
					"success": "#4ade80",
					"warning": "#fbbf24",
					"error": "#f43f5e",
				},
			},
			"light",
		],
		input: {
			'padding': '0.5rem',
			'height': '2rem',
		}
	},
	content: [
		"./src/**/*.{html,ts}",
	],
	theme: {
		extend: {},
	},
	plugins: [
		require('daisyui'),
	],
}

