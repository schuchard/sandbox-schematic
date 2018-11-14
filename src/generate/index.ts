import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  externalSchematic,
  chain,
} from '@angular-devkit/schematics/';

import { dasherize, classify, camelize } from '@angular-devkit/core/src/utils/strings';
import { addPropertyToPackageJson, readJsonFile } from './util';

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
      updateGitIgnore(options),
      updateCollectionJson(options),
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

export function updateGitIgnore(options: ConfigOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const gitIgnorePath = `${options.name}/.npmignore`;
    const ignoreRules = [
      '*.js.map',
      '!src/**/__files__/**/*.js',
      '!src/**/files/**/*.ts',
      '*.vscode',
      'sandbox',
    ];

    if (host.exists(gitIgnorePath)) {
      const buffer = host.read(gitIgnorePath);

      if (buffer === null) {
        // unable to read file
        return host;
      }

      const gitIgnoreBuffer = buffer.toString();

      const modifiedEditorConfig = gitIgnoreBuffer
        .split('\n')
        .concat(ignoreRules)
        .join('\n');

      host.overwrite(gitIgnorePath, modifiedEditorConfig);
    }
    return host;
  };
}

export function updateCollectionJson(options: ConfigOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    let collection = readJsonFile(host, `${options.name}/src/collection.json`).value as any;

    if (!collection) {
      return host;
    }

    collection.schematics[`ng-add`] = {
      description: `Add ${classify(options.name)} to an application.`,
      factory: `./${dasherize(options.name)}/index#${camelize(options.name)}`,
    };

    host.overwrite(`${options.name}/src/collection.json`, JSON.stringify(collection, null, 2));
  };
}
