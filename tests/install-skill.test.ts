import { afterEach, expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { copyFile, lstat, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { installSkill, parseArgs } from '../scripts/install-skill.mjs';

const temporary: string[] = [];
afterEach(async () => { for (const path of temporary.splice(0)) await rm(path, { recursive: true, force: true }); });
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'want-skill-test-'));
  temporary.push(root);
  const source = join(root, 'bundle');
  const cwd = join(root, 'project with spaces');
  const home = join(root, 'personal');
  await mkdir(join(source, 'references'), { recursive: true });
  await mkdir(cwd);
  await writeFile(join(source, 'SKILL.md'), '---\nname: want-design\ndescription: Want interfaces\n---\nТекст');
  await writeFile(join(source, 'references', 'tokens.json'), '{"primary":"#5962F0"}');
  return { root, source, cwd, home };
}

test('project install copies the payload and a repeat preserves extra user files', async () => {
  const input = await fixture();
  const first = await installSkill(input);
  expect(first.target).toBe(join(input.cwd, '.agents/skills/want-design'));
  expect(await readFile(join(first.target, 'SKILL.md'), 'utf8')).toBe(await readFile(join(input.source, 'SKILL.md'), 'utf8'));
  expect(await readFile(join(first.target, 'references/tokens.json'), 'utf8')).toBe('{"primary":"#5962F0"}');
  await writeFile(join(first.target, 'local-note.md'), 'Keep');
  expect((await installSkill(input)).alreadyInstalled).toBe(true);
  expect(await readFile(join(first.target, 'local-note.md'), 'utf8')).toBe('Keep');
});

test('global and custom destinations stay inside the requested locations', async () => {
  const input = await fixture();
  expect((await installSkill({ ...input, global: true })).target).toBe(join(input.home, '.agents/skills/want-design'));
  expect((await installSkill({ ...input, dest: 'custom skills' })).target).toBe(join(input.cwd, 'custom skills/want-design'));
  expect((await installSkill({ ...input, dest: join(input.root, 'absolute') })).target).toBe(join(input.root, 'absolute/want-design'));
});

test('different, incomplete, and symlink destinations are preserved', async () => {
  const input = await fixture();
  const { target } = await installSkill(input);
  await writeFile(join(target, 'SKILL.md'), 'Local instructions');
  await expect(installSkill(input)).rejects.toThrow('different installation');
  expect(await readFile(join(target, 'SKILL.md'), 'utf8')).toBe('Local instructions');
  await writeFile(join(target, 'SKILL.md'), await readFile(join(input.source, 'SKILL.md')));
  await rm(join(target, 'references/tokens.json'));
  await expect(installSkill(input)).rejects.toThrow('different installation');
  const elsewhere = join(input.root, 'elsewhere');
  await mkdir(elsewhere);
  await mkdir(join(input.cwd, 'linked'));
  await symlink(elsewhere, join(input.cwd, 'linked/want-design'));
  await expect(installSkill({ ...input, dest: 'linked' })).rejects.toThrow('regular directory');
  expect((await lstat(join(input.cwd, 'linked/want-design'))).isSymbolicLink()).toBe(true);
});

test('invalid bundles fail before creating a destination', async () => {
  const input = await fixture();
  await rm(join(input.source, 'SKILL.md'));
  await expect(installSkill(input)).rejects.toThrow('missing SKILL.md');
  expect(await lstat(join(input.cwd, '.agents')).catch(() => null)).toBeNull();
  await writeFile(join(input.source, 'SKILL.md'), 'Skill');
  await symlink(join(input.source, 'SKILL.md'), join(input.source, 'linked.md'));
  await expect(installSkill(input)).rejects.toThrow('Unsupported skill resource');
  expect(await lstat(join(input.cwd, '.agents')).catch(() => null)).toBeNull();
});

test('arguments reject conflicting and incomplete options', () => {
  expect(parseArgs(['--global']).global).toBe(true);
  expect(parseArgs(['--', '--dest', 'path with spaces']).dest).toBe('path with spaces');
  expect(parseArgs(['--help']).help).toBe(true);
  for (const args of [['--unknown'], ['--dest'], ['--dest', '--global'], ['--global', '--dest', 'path'], ['--dest', 'a', '--dest', 'b']]) {
    expect(() => parseArgs(args)).toThrow();
  }
});

test('standalone Node CLI works through a bin symlink without the checkout', async () => {
  const input = await fixture();
  const dist = join(input.root, 'dist');
  await mkdir(dist);
  const script = join(dist, 'install-skill.mjs');
  await copyFile(resolve('scripts/install-skill.mjs'), script);
  const { cp } = await import('node:fs/promises');
  await cp(input.source, join(dist, 'skill'), { recursive: true });
  const bin = join(input.root, 'want-design-install');
  await symlink(script, bin);
  const args = [bin, '--dest', 'local skills'];
  expect(execFileSync('node', args, { cwd: input.cwd, encoding: 'utf8' })).toContain('Installed:');
  expect(execFileSync('node', args, { cwd: input.cwd, encoding: 'utf8' })).toContain('Already installed:');
  expect(execFileSync('node', [bin, '--help'], { encoding: 'utf8' })).toContain('--global');
  expect(await readFile(join(input.cwd, 'local skills/want-design/SKILL.md'), 'utf8')).toContain('Текст');
});
