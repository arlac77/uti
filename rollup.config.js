import pkg from './package.json';

export default {
  plugins: [],

  output: {
    file: pkg.main,
    format: 'cjs'
  },

  external: [],
  input: pkg.module
};
