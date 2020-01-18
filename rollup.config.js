import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import buble from '@rollup/plugin-buble';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';


const terserMinified = terser({
  sourcemap: false,
  warnings: true,
  ecma: 5,
  ie8: false,
  toplevel: true,
  compress: {
    keep_infinity: true,
    pure_getters: true,
    passes: 10
  },
  output: {
    comments: false
  }
});

const plugins = [
  nodeResolve({
    mainFields: ['module', 'jsnext', 'main'],
    browser: true
  }),
  commonjs({
    ignoreGlobal: true,
    include: /\/node_modules\//,
  }),
  buble({
    transforms: {
      unicodeRegExp: false,
      dangerousForOf: true,
      dangerousTaggedTemplateString: true
    },
    objectAssign: 'Object.assign',
    exclude: 'node_modules/**'
  }),
  babel({
    babelrc: false,
    exclude: 'node_modules/**',
    presets: [],
    plugins: [
      'babel-plugin-codegen'
    ]
  }),
  terserMinified,
];

export default {
  input: './src/index.js',
  external: () => true,
  treeshake: { propertyReadSideEffects: false },
  plugins,
  output: [
    {
      sourcemap: false,
      legacy: true,
      freeze: false,
      esModule: false,
      file: `./dist/tiny-css-prefixer.js`,
      format: 'cjs',
    },
    {
      sourcemap: false,
      legacy: true,
      freeze: false,
      esModule: false,
      file: `./dist/tiny-css-prefixer.es.js`,
      format: 'esm',
      plugins: [
        filesize()
      ]
    },
  ],
};
