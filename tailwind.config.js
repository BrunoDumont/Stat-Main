module.exports = {
    purge: [
        './src/public/*.html',
        './src/*.tsx',
        './src/**/*.tsx',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'gold': '#E0BB87',
                'gold-hover': '#CCAA7A',
                'gold-active': '#E5C8A0',
                'myGray': '#B4B4BF',
                'myGray-hover': '#9C9CA6',
                'myGray-active': '#D0D0D9',
            },
        },
    },
    variants: {
        width: ["responsive", "hover", "focus"]
    },
    plugins: [],
}
