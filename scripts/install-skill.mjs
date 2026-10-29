#!/usr/bin/env node
import { lstat, mkdir, readdir, readFile, realpath, rmdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const help = `Install the Want design skill.

Usage: want-design-install [--global | --dest PATH]

  default       Install into .agents/skills/want-design in the current directory
  --global      Install into ~/.agents/skills/want-design
  --dest PATH   Use another parent skills directory
  --help        Show this help

Matching installations are unchanged. Different installations are never overwritten.
`;

export function parseArgs(args) {
  const options = { global: false, dest: undefined, help: false };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--') continue;
    if (arg === '--global') options.global = true;
    else if (arg === '--help') options.help = true;
    else if (arg === '--dest') {
      const value = args[++index];
      if (options.dest !== undefined || !value?.trim() || value.startsWith('-')) throw new Error('--dest requires one directory path.');
      options.dest = value;
    } else throw new Error('Unknown argument: ' + arg);
  }
  if (options.global && options.dest !== undefined) throw new Error('Use either --global or --dest, not both.');
  return options;
}

async function inspect(path) {
  try { return await lstat(path); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function payload(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(join(directory, prefix), { withFileTypes: true })) {
    const name = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await payload(directory, name));
    else if (entry.isFile()) files.push({ name, content: await readFile(join(directory, name)) });
    else throw new Error('Unsupported skill resource: ' + name);
  }
  return files;
}

export async function installSkill({ source, cwd = process.cwd(), global = false, dest, home = homedir() }) {
  if (global && dest !== undefined) throw new Error('Use either --global or --dest, not both.');
  const files = await payload(source);
  if (!files.some(file => file.name === 'SKILL.md')) throw new Error('The skill bundle is missing SKILL.md.');
  const parent = global ? join(home, '.agents', 'skills') : dest !== undefined ? resolve(cwd, dest) : join(cwd, '.agents', 'skills');
  const target = join(parent, 'want-design');
  const existing = await inspect(target);
  if (existing) {
    if (!existing.isDirectory() || existing.isSymbolicLink()) throw new Error('The skill destination must be a regular directory: ' + target);
    for (const file of files) {
      let path = target;
      const parts = file.name.split(sep);
      for (let index = 0; index < parts.length; index++) {
        path = join(path, parts[index]);
        const entry = await inspect(path);
        const valid = entry && !entry.isSymbolicLink() && (index === parts.length - 1 ? entry.isFile() : entry.isDirectory());
        if (!valid) throw new Error('A different installation exists. Move it to a backup before installing: ' + target);
      }
      if (!(await readFile(path)).equals(file.content)) throw new Error('A different installation exists. Move it to a backup before installing: ' + target);
    }
    return { target, alreadyInstalled: true };
  }
  await mkdir(parent, { recursive: true });
  await mkdir(target);
  const directories = new Set([target]);
  const written = [];
  try {
    for (const file of files) {
      let directory = target;
      for (const part of dirname(file.name).split(sep).filter(part => part !== '.')) {
        directory = join(directory, part);
        if (!directories.has(directory)) {
          await mkdir(directory);
          directories.add(directory);
        }
      }
      const path = join(target, file.name);
      await writeFile(path, file.content, { flag: 'wx' });
      written.push({ path, content: file.content });
    }
  } catch (error) {
    for (const file of written.reverse()) {
      try { if ((await readFile(file.path)).equals(file.content)) await unlink(file.path); } catch {}
    }
    for (const directory of [...directories].reverse()) { try { await rmdir(directory); } catch {} }
    throw new Error('Installation stopped at ' + target + ': ' + error.message);
  }
  return { target, alreadyInstalled: false };
}

if (process.argv[1] && await realpath(process.argv[1]).catch(() => null) === fileURLToPath(import.meta.url)) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) process.stdout.write(help);
    else {
      const result = await installSkill({ ...options, source: fileURLToPath(new URL('./skill/', import.meta.url)) });
      console.log((result.alreadyInstalled ? 'Already installed: ' : 'Installed: ') + result.target);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
