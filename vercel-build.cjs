// vercel-build.js
import { build } from 'vite';

try {
  await build();
} catch (err) {
  console.error('Vite build failed:', err);
  process.exit(1);
}
const { build } = require('vite');

build().catch((err) => {
  console.error('Vite build failed:', err);
  process.exit(1);
});
