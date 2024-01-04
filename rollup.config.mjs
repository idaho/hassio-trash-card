import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import ignore from './rollup-plugins/rollup-ignore-plugin.js';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const IGNORED_FILES = [
  '@material/mwc-notched-outline/mwc-notched-outline.js',
  '@material/mwc-ripple/mwc-ripple.js',
  '@material/mwc-list/mwc-list.js',
  '@material/mwc-list/mwc-list-item.js',
  '@material/mwc-menu/mwc-menu.js',
  '@material/mwc-menu/mwc-menu-surface.js',
  '@material/mwc-icon/mwc-icon.js',
  'lovelace-mushroom/src/shared/badge-icon.ts',
  'lovelace-mushroom/src/shared/form/mushroom-select.ts'
];

// eslint-disable-next-line no-process-env
const dev = process.env.ROLLUP_WATCH;

const serveOptions = {
  contentBase: [ './dist' ],
  host: '0.0.0.0',
  port: 5_200,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
};

const plugins = [
  ignore({
    files: IGNORED_FILES.map(file => require.resolve(file))
  }),
  typescript({
    declaration: false,
    exclude: [ '**/*.test.ts' ]
  }),
  nodeResolve(),
  json(),
  commonjs(),
  babel({
    babelHelpers: 'bundled'
  }),
  ...dev ? [ serve(serveOptions) ] : [ terser() ]
];

export default [
  {
    input: 'src/trashcard.ts',
    output: {
      dir: 'dist',
      format: 'es',
      inlineDynamicImports: true
    },
    plugins,
    moduleContext (id) {
      const thisAsWindowForModules = [
        'node_modules/@formatjs/intl-utils/lib/src/diff.js',
        'node_modules/@formatjs/intl-utils/lib/src/resolve-locale.js'
      ];

      // eslint-disable-next-line no-underscore-dangle
      if (thisAsWindowForModules.some(id_ => id.trimEnd().endsWith(id_))) {
        return 'window';
      }
    }
  }
];
