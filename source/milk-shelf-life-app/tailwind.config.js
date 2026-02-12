/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '24px',
				sm: '24px',
				md: '32px',
				lg: '32px',
				xl: '32px',
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1200px',
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Primary Brand
				primary: {
					50: '#E6F0FF',
					100: '#CCE0FF',
					500: '#0066FF',
					600: '#0052CC',
					900: '#003D99',
					DEFAULT: '#0066FF',
				},
				// Semantic Status Colors
				success: {
					500: '#10B981',
					700: '#047857',
					DEFAULT: '#10B981',
				},
				warning: {
					500: '#F59E0B',
					700: '#B45309',
					DEFAULT: '#F59E0B',
				},
				critical: {
					500: '#EF4444',
					700: '#B91C1C',
					DEFAULT: '#EF4444',
				},
				// Neutral Grays (90% of Interface)
				neutral: {
					50: '#FAFAFA',
					100: '#F5F5F5',
					200: '#E5E5E5',
					500: '#A3A3A3',
					700: '#404040',
					900: '#171717',
				},
				// Background Hierarchy
				background: {
					page: '#FAFAFA',
					surface: '#F5F5F5',
					elevated: '#FFFFFF',
					DEFAULT: '#FAFAFA',
				},
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
			},
			fontSize: {
				hero: ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
				'title-large': ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
				title: ['32px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
				'body-large': ['20px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
				body: ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
				small: ['14px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
				caption: ['12px', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '400' }],
			},
			spacing: {
				'8': '8px',
				'16': '16px',
				'24': '24px',
				'32': '32px',
				'48': '48px',
				'64': '64px',
				'96': '96px',
			},
			borderRadius: {
				sm: '8px',
				md: '12px',
				lg: '16px',
				xl: '24px',
				DEFAULT: '12px',
			},
			boxShadow: {
				card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
				'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
				modal: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
			},
			transitionDuration: {
				fast: '200ms',
				base: '250ms',
				slow: '300ms',
			},
			transitionTimingFunction: {
				out: 'cubic-bezier(0, 0, 0.2, 1)',
				'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			keyframes: {
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				slideIn: {
					from: {
						opacity: '0',
						transform: 'translateX(-20px)',
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)',
					},
				},
				pageEnter: {
					from: {
						opacity: '0',
						transform: 'translateY(20px)',
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)',
					},
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
			},
			animation: {
				pulse: 'pulse 2s ease-in-out infinite',
				slideIn: 'slideIn 300ms ease-out',
				pageEnter: 'pageEnter 300ms ease-out',
				shimmer: 'shimmer 1.5s ease-in-out infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
