const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/index.js',
  format: 'cjs',
  minify: true,
  sourcemap: false,
  external: [],
  logLevel: 'verbose',
  treeShaking: true,
}).catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
