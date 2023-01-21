/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  purge: {
    options: {
      safelist: [
        'bg-red-600',
        'bg-orange-500',
        'bg-amber-500',
        'bg-yellow-300',
        'bg-lime-200',
        'bg-green-500',
        'bg-emerald-500',
        'bg-teal-500',
        'bg-blue-900',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-purple-500',
        'bg-fuchsia-500',
        'bg-rose-500'
      ]
    }
  },
  theme: {
    extend: {}
  },
  plugins: [require('flowbite/plugin')]
};
