const plugin = require('tailwindcss/plugin');
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;
const toColorValue = require('tailwindcss/lib/util/toColorValue').default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-safe-area'),
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-animate'),
    plugin(
      ({ addComponents, matchUtilities, theme }) => {
        const defaultBgColor = theme('colors.gray.300');

        addComponents({
          '.scrollbar': {
            '--scrollbar-color': defaultBgColor,
            '--scrollbar-width': '4px',
            '--scrollbar-radius': '2px',
          },
          '.scrollbar::-webkit-scrollbar': {
            width: 'var(--scrollbar-width)',
          },
          '.scrollbar::-webkit-scrollbar-thumb': {
            'background-color': 'var(--scrollbar-color)',
            'border-radius': 'var(--scrollbar-radius)',
          },
        });

        matchUtilities(
          {
            scrollbar: value => {
              if (!/px$/.test(value)) {
                return {};
              }

              return {
                '--scrollbar-width': value,
                '--scrollbar-radius': value.replace('px', '') / 2 + 'px',
              };
            },
          },
          { values: theme('scrollbarWidth') },
        );

        matchUtilities(
          {
            scrollbar: value => {
              return {
                '--scrollbar-color': toColorValue(value),
              };
            },
            flattenColorPalette,
          },
          { values: flattenColorPalette(theme('colors')), type: 'color' },
        );
      },
      {
        theme: {
          scrollbarWidth: {
            0.5: '2px',
            1: '4px',
            1.5: '6px',
            2: '8px',
          },
        },
      },
    ),
  ],
};
