export type InstallOptions = {
  source: string;
  cwd?: string;
  global?: boolean;
  dest?: string;
  home?: string;
};
export function parseArgs(args: string[]): { global: boolean; dest: string | undefined; help: boolean };
export function installSkill(options: InstallOptions): Promise<{ target: string; alreadyInstalled: boolean }>;
