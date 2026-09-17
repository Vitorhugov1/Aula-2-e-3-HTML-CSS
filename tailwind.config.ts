import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: {
    colors: { ink:'#080909', coal:'#101111', gold:'#f3c316', muted:'#a8aaa7' },
    fontFamily: { display:['var(--font-space)','sans-serif'], body:['var(--font-inter)','sans-serif'] },
  } }, plugins: [],
}
export default config
