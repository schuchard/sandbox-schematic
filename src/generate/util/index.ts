import { get } from 'http';
import { Tree, SchematicsException, SchematicContext } from '@angular-devkit/schematics';
import {
  parseJson,
  JsonParseMode,
  JsonValue,
  JsonAstObject,
  parseJsonAst,
} from '@angular-devkit/core';
import {
  findPropertyInAstObject,
  insertPropertyInAstObjectInOrder,
  appendPropertyInAstObject,
} from '@schematics/angular/utility/json-utils';

export interface NpmRegistryPackage {
  name: string;
  version: string;
}

export enum Config {
  PackageJsonPath = 'package.json',
  JsonIndentLevel = 4,
}
export function getLatestNodeVersion(packageName: string): Promise<NpmRegistryPackage> {
  const DEFAULT_VERSION = 'latest';

  return new Promise((resolve) => {
    return get(`http://registry.npmjs.org/${packageName}`, (res) => {
      let rawData = '';
      res.on('data', (chunk) => (rawData += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(rawData);
          const version = (response && response['dist-tags']) || {};

          resolve(buildPackage(packageName, version.latest));
        } catch (e) {
          resolve(buildPackage(packageName));
        }
      });
    }).on('error', () => resolve(buildPackage(packageName)));
  });

  function buildPackage(name: string, version: string = DEFAULT_VERSION): NpmRegistryPackage {
    return { name, version };
  }
}

export function getFileAsJson(host: Tree, path: string): JsonValue {
  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const content = configBuffer.toString();

  return parseJson(content, JsonParseMode.Loose);
}

export function addPropertyToPackageJson(
  tree: Tree,
  context: SchematicContext,
  propertyName: string,
  propertyValue: { [key: string]: any },
  dir: string
) {
  const _packageJsonPath = `${dir}/package.json`;
  const packageJsonAst = readJsonFile(tree, _packageJsonPath);
  const pkgNode = findPropertyInAstObject(packageJsonAst, propertyName);
  const recorder = tree.beginUpdate(packageJsonPath(_packageJsonPath));

  if (!pkgNode) {
    // outer node missing, add key/value
    appendPropertyInAstObject(
      recorder,
      packageJsonAst,
      propertyName,
      propertyValue,
      Config.JsonIndentLevel
    );
  } else if (pkgNode.kind === 'object') {
    // property exists, update values
    for (let [key, value] of Object.entries(propertyValue)) {
      const innerNode = findPropertyInAstObject(pkgNode, key);

      if (!innerNode) {
        // script not found, add it
        context.logger.debug(`creating ${key} with ${value}`);

        insertPropertyInAstObjectInOrder(recorder, pkgNode, key, value, Config.JsonIndentLevel);
      } else {
        // script found, overwrite value
        context.logger.debug(`overwriting ${key} with ${value}`);

        const { end, start } = innerNode;

        recorder.remove(start.offset, end.offset - start.offset);
        recorder.insertRight(start.offset, JSON.stringify(value));
      }
    }
  }

  tree.commitUpdate(recorder);
}

export function readJsonFile(tree: Tree, path?: string): JsonAstObject {
  const buffer = tree.read(packageJsonPath(path));
  if (buffer === null) {
    throw new SchematicsException(`Could not read json at ${path}`);
  }
  const content = buffer.toString();

  const packageJson = parseJsonAst(content, JsonParseMode.Strict);
  if (packageJson.kind != 'object') {
    throw new SchematicsException('Invalid json. Was expecting an object');
  }

  return packageJson;
}

function packageJsonPath(path?: string) {
  return  path ? path : Config.PackageJsonPath ;
}