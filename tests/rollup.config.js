import multiEntry from "rollup-plugin-multi-entry";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import istanbul from "rollup-plugin-istanbul";

export default {
  input: "tests/**/*-test.js",
  output: {
    file: "build/bundle-test.js",
    format: "cjs",
    sourcemap: true,
    interop: false
  },
  external: ["ava", "fs", "path", "util"],
  plugins: [
    multiEntry(),
    resolve(),
    commonjs(),
    json(),
    istanbul({
      exclude: ["tests/**/*-test.js", "node_modules/**/*"]
    })
  ]
};
