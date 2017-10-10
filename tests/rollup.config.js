export default {
  input: 'tests/uti-test.js',
  external: ['ava'],

  output: {
    file: 'build/uti-test.js',
    format: 'cjs',
    sourcemap: true
  }
};
