import babel from 'rollup-plugin-babel';

export default {
    input: './src/index.js',
    output: {
        name: 'rwl',
        file: './dist/rwl.js',
        format: 'umd'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
    ]

};