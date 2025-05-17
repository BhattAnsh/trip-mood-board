import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Neomorphic colors
				neo: {
					bg: '#F0F0F3',
					shadow1: '#FFFFFF',
					shadow2: '#BABECC',
					text: '#555555',
					accent: 'var(--mood-color)',
				},
				mood: {
					blue: '#60A5E6', 
					green: '#60E6A5',
					purple: '#9B60E6',
					pink: '#E660A5',
					orange: '#E6A560'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'slide-in': {
					'0%': { 
						transform: 'translateX(-100%)',
						opacity: '0'
					},
					'100%': { 
						transform: 'translateX(0)',
						opacity: '1' 
					},
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'float': {
					'0%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
					'100%': { transform: 'translateY(0px)' },
				},
				'float-slow': {
					'0%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-8px) rotate(2deg)' },
					'100%': { transform: 'translateY(0px) rotate(0deg)' },
				},
				'float-slower': {
					'0%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-5px) rotate(-2deg)' },
					'100%': { transform: 'translateY(0px) rotate(0deg)' },
				},
				'pulse-slow': {
					'0%': { opacity: '0.6' },
					'50%': { opacity: '1' },
					'100%': { opacity: '0.6' },
				},
				'bounce-slow': {
					'0%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' },
					'100%': { transform: 'translateY(0)' },
				},
				'music-progress': {
					'0%': { width: '0%' },
					'100%': { width: '100%' },
				},
				'waveAnimation': {
					'0%': { transform: 'scaleY(1)' },
					'50%': { transform: 'scaleY(1.5)' },
					'100%': { transform: 'scaleY(1)' },
				},
				'gradient-x': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'100%': { backgroundPosition: '100% 50%' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-in': 'slide-in 0.4s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'float-slow': 'float-slow 5s ease-in-out infinite',
				'float-slower': 'float-slower 7s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
				'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
				'music-progress': 'music-progress 15s linear infinite',
				'gradient-x': 'gradient-x 15s ease infinite',
				'gradient-shift': 'gradient-shift 15s ease infinite',
			},
			boxShadow: {
				'neo-flat': 'var(--neo-shadow-flat)',
				'neo-pressed': 'var(--neo-shadow-pressed)',
				'neo-convex': 'var(--neo-shadow-convex)',
				'neo-card': 'var(--neo-shadow-card)',
				'neo-card-hover': 'var(--neo-shadow-card-hover)',
				'neo-mood-flat': 'var(--neo-mood-shadow-flat)',
				'neo-mood-pressed': 'var(--neo-mood-shadow-pressed)',
				'neo-mood-convex': 'var(--neo-mood-shadow-convex)',
			},
			scale: {
				'102': '1.02',
			},
		}
	},
	plugins: [
		animate,
		function({ addUtilities }) {
			const newUtilities = {
				'.pattern-dots': {
					backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
					backgroundSize: 'calc(10 * 1px) calc(10 * 1px)',
				},
				'.pattern-grid': {
					backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(to right, currentColor 1px, transparent 1px)',
					backgroundSize: '20px 20px',
				},
			};
			
			addUtilities(newUtilities, ['responsive', 'hover']);
		},
	],
} satisfies Config;
