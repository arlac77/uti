import pkg from './package.json';

export default {
  plugins: [],
  targets: [{
    dest: pkg.main,
    format: 'cjs'
  }],
  external: []
};
