import istanbul from 'rollup-plugin-istanbul';

import multiEntry from 'rollup-plugin-multi-entry';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'tests/uti-test.js',
  external: ['ava', 'fs', 'path', 'util'],
  plugins: [resolve(), commonjs(), multiEntry(), istanbul({
    exclude: ['tests/**/*-test.js']
  })],

  output: {
    file: 'build/uti-test.js',
    format: 'cjs',
    sourcemap: true,
    interop: false
  }
};
