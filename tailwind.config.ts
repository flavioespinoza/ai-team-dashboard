import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
// ✅ Tailwind v4 default theme and colors
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	darkMode: 'class',
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px'
		},
		fontSize: {
			sm: ['0.875rem', { lineHeight: '1.25rem' }],
			base: ['1rem', { lineHeight: '1.5rem' }],
			lg: ['1.125rem', { lineHeight: '1.75rem' }],
			xl: ['1.25rem', { lineHeight: '1.75rem' }]
		},
		fontFamily: {
			sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
			display: ['Inter', ...defaultTheme.fontFamily.sans]
		},
		colors: {
			// ✅ Base Tailwind palettes (use from `colors` default import)
			gray: colors.gray,
			zinc: colors.zinc,
			slate: colors.slate,
			neutral: colors.neutral,
			stone: colors.stone,
			blue: colors.blue,
			emerald: colors.emerald,
			red: colors.red,
			yellow: colors.yellow,
			green: colors.green,
			sky: colors.sky,

			// ✅ Brand system colors
			primary: { DEFAULT: '#4cb8ab', foreground: '#ffffff' },
			secondary: { DEFAULT: '#636e5b', foreground: '#ffffff' },
			critical: { DEFAULT: '#fe3557', foreground: '#ffffff' },

			// ✅ Background and UI
			background: '#ff8200',
			foo: '#ffffff',
			card: { DEFAULT: '#ffffff', dark: '#111827' },
			border: '#e5e7eb',

			// ✅ Custom brand hues
			cblue: {
				50: '#f5fbfc',
				100: '#e8f6f7',
				200: '#c9e9ec',
				300: '#a0d5da',
				400: '#6dbac2',
				500: '#4cb8ab',
				600: '#399b91',
				700: '#347f79',
				800: '#2d6864',
				900: '#275854',
				950: '#153836'
			},
			hotpink: {
				50: '#fff0f2',
				100: '#ffdce0',
				200: '#ffb7c1',
				300: '#ff8a99',
				400: '#fe4f67',
				500: '#fe3557',
				600: '#eb173b',
				700: '#c50e2f',
				800: '#a0102b',
				900: '#83132a',
				950: '#4a0412'
			},
			sage: {
				50: '#f4f5f4',
				100: '#e6e8e3',
				200: '#ced1c9',
				300: '#aab1a4',
				400: '#808a78',
				500: '#636e5b',
				600: '#4b5645',
				700: '#3c4438',
				800: '#31372e',
				900: '#292e26',
				950: '#161915'
			},

			// ✅ Utility neutrals
			white: '#ffffff',
			black: '#000000',
			main: '#FAFAFA',
			'light-gray': '#e9e8eb',
			graysoft: '#F2F2F2',
			slatesoft: '#F5F5F5',
			cement: '#AEB3B7',
			charcoal: '#292D2A',
			'light-blue': '#bfdbff',
			'light-green': '#E8F5E9',
			brightgreen: '#34da60',

			// ✅ Background modes
			'background-light': '#F8FAFC',
			'background-dark': '#18181B',

			// ✅ Chart placeholders
			chart: {
				1: 'var(--chart-1)',
				2: 'var(--chart-2)',
				3: 'var(--chart-3)',
				4: 'var(--chart-4)',
				5: 'var(--chart-5)'
			}
		},
		borderRadius: {
			DEFAULT: '0.5rem',
			lg: '0.75rem',
			xl: '1rem'
		}
	},
	plugins: []
}

export default config
