export default {
    input: './src/index.js',
    output: [{
        file: 'dist/rwl-cjs.js',
        format: 'cjs'
      },
      {
        file: './dist/rwl.mjs',
        format: 'es'
      }, 
      {
        file: 'dist/rwl-amd.js',
        format: 'amd',
      },
      {
        file: 'dist/rwl-iife.js',
        format: 'iife',
        name: 'rwl'
      },
    ]
};