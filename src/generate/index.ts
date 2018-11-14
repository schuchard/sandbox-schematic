import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  externalSchematic,
  chain,
} from '@angular-devkit/schematics/';

import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { addPropertyToPackageJson } from './util';

export interface ConfigOptions {
  name: string;
  author?: string;
}

export default function(options: ConfigOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.name) {
      throw new SchematicsException('Option (name) is required.');
    }

    return chain([
      createSchematicFiles(options),
      createSandbox(options),
      setupSchematicScripts(options),
    ])(host, context);
  };
}

export function createSchematicFiles(options: ConfigOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return externalSchematic('@schematics/schematics', 'blank', options);
  };
}

export function createSandbox(options: ConfigOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return externalSchematic('@schematics/angular', 'ng-new', {
      directory: `${options.name}/sandbox`,
      name: 'sandbox',
      style: 'css',
      version: '7',
    });
  };
}

export function setupSchematicScripts(options: ConfigOptions): Rule {
  const newScripts = {
    build: 'tsc -p tsconfig.json',
    clean: 'git checkout HEAD -- sandbox && git clean -f -d sandbox',
    'clean:launch': 'yarn clean && yarn launch',
    launch: `cd sandbox && ng g ${dasherize(options.name)}:${dasherize(options.name)}`,
    'build:clean:launch': 'yarn build && yarn clean:launch',
    'test:sandbox': 'cd sandbox && yarn lint && yarn test && yarn e2e && yarn build',
    'link:schematic': `yarn link && cd sandbox && yarn link ${dasherize(options.name)}`,
    test: 'yarn build:clean:launch && yarn test:sandbox && yarn clean',
    'test:unit': 'npm run build && jasmine src/**/*_spec.js',
    'setup:once': 'yarn && yarn link:schematic && yarn',
  };
  return (host: Tree, context: SchematicContext) => {
    Object.entries(newScripts).forEach(([key, val]) => {
      addPropertyToPackageJson(host, context, `scripts`, { [key]: val }, options.name);
    });
    return host;
  };
}

// add ng-add
// "ng-add": {
//   "description": "Add <%= name %>",
//   "factory": "./<%= dasherize(name) %>/index",
//   "schema": "./<%= dasherize(name) %>/schema.json"
// },

// update gitignore to save files dir
// !src/__files__/**/*.js
// !src/files/**/*.js

// add files