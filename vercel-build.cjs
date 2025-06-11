
const { build } = require('vite');

build().catch((err) => {
  console.error('Vite build failed:', err);
  process.exit(1);
});
