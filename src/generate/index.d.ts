import { Rule } from '@angular-devkit/schematics/';
export interface ConfigOptions {
  name: string;
  author?: string;
  skipInstall?: boolean;
  skipGit?: boolean;
  commit?: any;
}
export default function(options: ConfigOptions): Rule;
export declare function createSchematicFiles(options: ConfigOptions): Rule;
export declare function createSandbox(options: ConfigOptions): Rule;
export declare function setupSchematicScripts(options: ConfigOptions): Rule;
export declare function updateGitIgnore(options: ConfigOptions): Rule;
export declare function updateCollectionJson(options: ConfigOptions): Rule;
export declare function handleGit(options: ConfigOptions): Rule;
