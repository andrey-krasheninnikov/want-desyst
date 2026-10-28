import { build } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { mkdir, copyFile, cp, readFile, rm } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { themeCss } from './theme-css';

const root = process.cwd();
const foundation = resolve(root, 'packages/foundation');
await rm(foundation + '/dist', { recursive: true, force: true });
await rm(resolve(root, '.types'), { recursive: true, force: true });
await mkdir(foundation + '/dist', { recursive: true });
await Bun.write(foundation + '/dist/tokens.css', themeCss());
await build({
  configFile: false, root: foundation, plugins: [tailwindcss()],
  build: { emptyOutDir: false, cssCodeSplit: true, lib: { entry: { index: foundation + '/src/index.ts' }, formats: ['es'], fileName: (_, name) => name + '.js' },
    rollupOptions: { output: { assetFileNames: asset => asset.names.some(name => name.endsWith('.css')) ? '[name][extname]' : 'assets/[name][extname]' } } }
});
await cp(foundation + '/src/assets', foundation + '/dist/assets', { recursive: true });
await copyFile(foundation + '/src/tailwind.css', foundation + '/dist/tailwind.css');
let fontCss = '';
for (const name of ['@fontsource-variable/manrope', '@fontsource/days-one', '@fontsource-variable/noto-sans-jp', '@fontsource-variable/noto-sans-arabic']) {
  const entry = Bun.resolveSync(name, foundation);
  const directory = dirname(entry);
  const family = name.split('/').at(-1)!;
  const css = await readFile(entry, 'utf8');
  const assets = [...css.matchAll(/url\((['"]?)(\.\/files\/[^)'"]+)\1\)/g)];
  await mkdir(foundation + '/dist/assets/fonts/' + family, { recursive: true });
  for (const match of assets) await copyFile(resolve(directory, match[2]!), foundation + '/dist/assets/fonts/' + family + '/' + basename(match[2]!));
  fontCss += css.replace(/url\((['"]?)(\.\/files\/[^)'"]+)\1\)/g, (_, quote, file) => 'url("./assets/fonts/' + family + '/' + basename(file) + '")') + '\n';
  await mkdir(foundation + '/dist/licenses', { recursive: true });
  await copyFile(directory + '/LICENSE', foundation + '/dist/licenses/' + family + '.txt');
}
await Bun.write(foundation + '/dist/fonts.css', fontCss);
const react = resolve(root, 'packages/react');
await rm(react + '/dist', { recursive: true, force: true });
await build({ configFile: false, root: react, build: {
  lib: { entry: react + '/src/index.ts', formats: ['es'], fileName: 'index' },
  rollupOptions: { external: id => !id.startsWith('.') && !id.startsWith('/'), output: { banner: '\"use client\";' } }
} });
const result = Bun.spawnSync(['bunx', 'tsc', '--project', 'tsconfig.build.json'], { stdout: 'inherit', stderr: 'inherit' });
if (result.exitCode !== 0) process.exit(result.exitCode);
for (const name of ['foundation', 'react']) {
  const packageRoot = resolve(root, 'packages', name);
  await cp(resolve(root, '.types', name, 'src'), packageRoot + '/dist', { recursive: true });
}
const declaration = foundation + '/dist/index.d.ts';
await Bun.write(declaration, (await readFile(declaration, 'utf8')).replace("import './styles.css';\n", ''));
console.log('Built both public packages.');
