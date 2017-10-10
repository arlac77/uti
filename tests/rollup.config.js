export default {
  input: 'tests/**/*-test.js',
  external: ['ava'],

  output: {
    file: 'build/bundle-test.js',
    format: 'cjs',
    sourcemap: true
  }
};
