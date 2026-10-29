import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm, stat, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const directory = await realpath(await mkdtemp(join(tmpdir(), 'want-desyst-consumer-')));
const run = (command: string, args: string[], cwd = directory) => execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 8 * 1024 * 1024 });
try {
  const tarballs: string[] = [];
  for (const name of ['foundation', 'react']) {
    const output: unknown = JSON.parse(run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', directory], resolve(root, 'packages', name)));
    assert(Array.isArray(output) && output.length === 1);
    const record = output[0];
    assert(record && record.filename === 'want-foundation-desyst-' + name + '-0.2.0.tgz');
    assert(Array.isArray(record.files));
    for (const file of record.files) {
      assert(typeof file.path === 'string' && !file.path.includes('..') && !file.path.startsWith('/'));
      assert(/^(dist\/|tokens\.json$|README\.md$|LICENSE$|THIRD_PARTY_NOTICES\.md$|package\.json$)/.test(file.path), file.path);
    }
    assert(record.files.some((file: { path: string }) => file.path === 'dist/index.d.ts'));
    tarballs.push(join(directory, record.filename));
  }
  const react = JSON.parse(await readFile(resolve(root, 'node_modules/react/package.json'), 'utf8')).version;
  await writeFile(join(directory, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', ...tarballs, 'react@' + react, 'react-dom@' + react, '@types/react@^19', '@types/react-dom@^19', 'typescript@5.9.3']);
  await writeFile(join(directory, 'check.mjs'), [
    "import assert from 'node:assert/strict';",
    "import React from 'react';",
    "import { renderToStaticMarkup } from 'react-dom/server';",
    "import { Button, DateField, MediaCard, UrlField, Window, Checkbox, DropdownMenu, Toast, Tooltip, Combobox, Popover, Table, Pagination, FileUpload, Progress, Typography, Prose, Loader, Shimmer, AnimatedText, Glow, Snackbar } from '@want-foundation/desyst-react';",
    "import { tokens, initInteractionEffects, initBackgroundMotion, burstConfetti } from '@want-foundation/desyst-foundation';",
    "assert.equal(typeof document, 'undefined');",
    "assert.equal(tokens.themes.wallpapers.dark.primary, '#5962F0');",
    "assert.equal(typeof initInteractionEffects, 'function');",
    "assert.equal(typeof initBackgroundMotion, 'function');",
    "assert.equal(typeof burstConfetti, 'function');",
    "assert.match(renderToStaticMarkup(React.createElement(Button, { variant: 'secondary' }, 'Independent consumer')), /Independent consumer/);",
    "assert.match(renderToStaticMarkup(React.createElement(MediaCard, { href: '/demo', title: 'Demo', image: {src:'/demo.svg',width:1600,height:900,alt:'Demo'} })), /height=\"900\"/);",
    "assert.match(renderToStaticMarkup(React.createElement(Window, { title: 'Consumer window' }, 'Content')), /Consumer window/);",
    "assert.match(renderToStaticMarkup(React.createElement(UrlField, { label: 'URL', value: 'https://example.com', openLabel: 'Open URL', onChange() {} })), /noopener noreferrer/);",
    "assert.equal(typeof DateField, 'function');",
    "assert.match(renderToStaticMarkup(React.createElement(Typography, {variant:'h2'}, 'Consumer heading')), /<h2/);",
    "assert.match(renderToStaticMarkup(React.createElement(Loader, {label:'Loading',variant:'bars'})), /Loading/);",
    "assert.match(renderToStaticMarkup(React.createElement(AnimatedText, {text:'Ready'})), /Ready/);",
    "assert.match(renderToStaticMarkup(React.createElement(Glow, {paused:true})), /aria-hidden/);",
    "for (const component of [Checkbox, DropdownMenu, Toast, Tooltip, Combobox, Popover, Table, Pagination, FileUpload, Progress, Typography, Prose, Loader, Shimmer, AnimatedText, Glow, Snackbar]) assert(component);",
    "assert.match(renderToStaticMarkup(React.createElement(Checkbox, { checked: 'indeterminate', 'aria-label': 'Select all' })), /aria-checked/);",
    "assert.match(renderToStaticMarkup(React.createElement(Progress, { label: 'Upload', value: 50 })), /aria-valuenow/);",
    "assert.match(renderToStaticMarkup(React.createElement(Combobox, { label: 'Project', value: 'demo', options: [{value:'demo',label:'Demo'}], emptyLabel: 'Empty', onValueChange() {} })), /combobox/);"
  ].join('\n'));
  run('node', ['check.mjs']);
  await writeFile(join(directory, 'check.tsx'), [
    "import { Button, DateField, UrlField, Window, ThemeToggle, MediaCard, type DateFieldLabels, type ThemeToggleProps } from '@want-foundation/desyst-react';",
    "const theme: ThemeToggleProps = { theme: 'dark', label: 'Theme', onThemeChange: value => console.log(value) };",
    "const control = <Button variant='secondary' onClick={event => { event.currentTarget.disabled = true; }}>Continue</Button>;",
    "const toggle = <ThemeToggle {...theme} />;",
    "const card = <MediaCard href='/work' title='Work' image={{src:'/work.svg',width:100,height:100,alt:'Work'}} />;",
    "const labels: DateFieldLabels = { date: 'Date', datetime: 'Date and time', calendar: 'Calendar', year: 'Year', previousYear: 'Previous year', previousMonth: 'Previous month', nextMonth: 'Next month', nextYear: 'Next year', hours: 'Hours', minutes: 'Minutes', today: 'Today', clear: 'Clear', apply: 'Apply' };",
    "const date = <DateField mode='date' value='2026-10-28' onChange={() => {}} locale='en-GB' labels={labels} />;",
    "const url = <UrlField label='URL' value='https://example.com' onChange={() => {}} openLabel='Open URL' />;",
    "const window = <Window title='Example'>Content</Window>;",
    "import { Checkbox, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, ToastProvider, Toast, ToastTitle, ToastViewport, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Combobox, Popover, PopoverTrigger, PopoverContent, Table, TableCaption, TableBody, TableRow, TableCell, Pagination, FileUpload, Progress, type ComboboxProps, type FileUploadProps, type PaginationProps } from '@want-foundation/desyst-react';",
    "const additional = <><Checkbox checked='indeterminate' aria-label='Select all' /><Progress label='Upload' value={50} /><Combobox label='Project' value='demo' options={[{value:'demo',label:'Demo'}]} emptyLabel='Empty' onValueChange={() => {}} /><Table><TableCaption>Results</TableCaption><TableBody><TableRow><TableCell>Demo</TableCell></TableRow></TableBody></Table><DropdownMenu><DropdownMenuTrigger>Actions</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onSelect={() => {}}>Copy</DropdownMenuItem></DropdownMenuContent></DropdownMenu><TooltipProvider><Tooltip><TooltipTrigger>Help</TooltipTrigger><TooltipContent>Information</TooltipContent></Tooltip></TooltipProvider><Popover><PopoverTrigger>Open</PopoverTrigger><PopoverContent aria-label='Details'>Details</PopoverContent></Popover><ToastProvider label='Notification'><Toast><ToastTitle>Saved</ToastTitle></Toast><ToastViewport label='Notifications' /></ToastProvider></>;",
    "const pagination = <Pagination page={1} pageSize={10} totalItems={12} onChange={() => {}} labels={{ navigation:'Pages', previous:'Previous', next:'Next', pageSize:'Rows', page: page => String(page), results:(from,to,total) => String(from) + ' to ' + to + ' of ' + total }} />;",
    "const files = <FileUpload label='Files' files={[]} onFilesChange={() => {}} labels={{choose:'Choose',drop:'Drop',remove:name => name,invalidType:name => name,tooLarge:name => name,tooMany:max => String(max)}} />;",
    "import { Typography, Prose, Loader, Shimmer, AnimatedText, Glow, SnackbarProvider, Snackbar, SnackbarViewport, type TypographyProps, type SnackbarProps } from '@want-foundation/desyst-react';",
    "const visual = <><Typography variant='h2' as='h3'>Consumer heading</Typography><Prose><p>Reading text</p></Prose><Loader label='Loading' variant='orbit' /><Shimmer label='Loading card' variant='card' /><AnimatedText text='Ready' effect='blur' /><div className='glow-host'><Glow paused /><Button>Continue</Button></div><SnackbarProvider label='Notification'><Snackbar variant='success' variantLabel='Success' title='Saved' closeLabel='Dismiss' /><SnackbarViewport label='Status messages' /></SnackbarProvider></>;",
    "// @ts-expect-error Unsupported variants must remain a type error.",
    "const invalid = <Button variant='unknown-variant'>Invalid</Button>;"
  ].join('\n'));
  run('node', ['node_modules/typescript/bin/tsc', '--noEmit', '--strict', '--skipLibCheck', '--jsx', 'react-jsx', '--module', 'ESNext', '--moduleResolution', 'Bundler', '--target', 'ES2022', '--resolveJsonModule', 'check.tsx']);
  const foundation = join(directory, 'node_modules/@want-foundation/desyst-foundation');
  const skillDestination = join(directory, 'installed skills');
  const installCommand = join(foundation, 'dist/install-skill.js');
  assert(run('node', [installCommand, '--dest', skillDestination]).includes('Installed:'));
  assert(run('node', [installCommand, '--dest', skillDestination]).includes('Already installed:'));
  const installedSkill = join(skillDestination, 'want-design');
  assert((await readFile(join(installedSkill, 'SKILL.md'), 'utf8')).includes('name: want-design'));
  assert.deepEqual(JSON.parse(await readFile(join(installedSkill, 'references/tokens.json'), 'utf8')), JSON.parse(await readFile(join(foundation, 'tokens.json'), 'utf8')));
  for (const name of ['brand-ui', 'voice', 'motion', 'react']) assert((await stat(join(installedSkill, 'references/' + name + '.md'))).size > 0);
  const css = await readFile(join(foundation, 'dist/index.css'), 'utf8');
  assert(css.includes(':focus-visible') && css.includes('.ui-date-popover') && css.includes('.ui-open-url') && css.includes('.ui-window') && ['.ui-checkbox', '.ui-dropdown-menu', '.ui-tooltip', '.ui-popover', '.ui-toast', '.ui-combobox', '.ui-table', '.ui-pagination', '.ui-file-upload', '.ui-progress', '.ui-typography', '.ui-prose', '.ui-loader', '.ui-shimmer', '.ui-animated-text', '.ui-glow', '.ui-snackbar'].every(selector => css.includes(selector)) && /#5962f0/i.test(css) && !css.includes('@apply'));
  const fonts = await readFile(join(foundation, 'dist/fonts.css'), 'utf8');
  const assets = [...fonts.matchAll(/url\(["']?([^)"']+)/g)];
  assert(assets.length > 4 && !fonts.includes('data:') && !fonts.includes('https:'));
  for (const match of assets) assert((await stat(resolve(foundation, 'dist', match[1]!))).size > 0);
  for (const name of ['manrope', 'days-one', 'noto-sans-jp', 'noto-sans-arabic']) assert((await stat(join(foundation, 'dist/licenses/' + name + '.txt'))).size > 0);
  const instances = run('npm', ['ls', 'react', '--parseable']).trim().split('\n').filter(path => path.endsWith('/node_modules/react'));
  assert.equal(instances.length, 1);
  await writeFile(join(directory, 'index.html'), '<!doctype html><html lang="en"><head><title>Package consumer</title></head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>');
  await writeFile(join(directory, 'main.tsx'), [
    "import React from 'react'; import { createRoot } from 'react-dom/client';",
    "import { Button, DateField, UrlField, Window } from '@want-foundation/desyst-react';",
    "import '@want-foundation/desyst-foundation/styles.css'; import '@want-foundation/desyst-foundation/fonts.css';",
    "const labels = { date: 'Date', datetime: 'Date and time', calendar: 'Calendar', year: 'Year', previousYear: 'Previous year', previousMonth: 'Previous month', nextMonth: 'Next month', nextYear: 'Next year', hours: 'Hours', minutes: 'Minutes', today: 'Today', clear: 'Clear', apply: 'Apply' };",
    "createRoot(document.getElementById('root')!).render(<Window title='Consumer window'><DateField mode='date' value='2026-10-28' onChange={() => {}} locale='en-GB' labels={labels} /><UrlField label='URL' value='https://example.com' onChange={() => {}} openLabel='Open URL' /><Button>Independent consumer</Button></Window>);"
  ].join('\n'));
  await build({ root: directory, configFile: false, logLevel: 'error' });
  console.log('Packed consumer passed: SSR, types, styles, local fonts/assets, standalone skill installation, one React instance and production web build.');
} finally {
  await rm(directory, { recursive: true, force: true });
  console.log('Temporary consumer and tarballs removed.');
}
