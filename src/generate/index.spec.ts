import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { ConfigOptions } from '.';

describe('Generate Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@schuchard/schematic-generator',
    require.resolve('../collection.json')
  );

  const name = 'foo';
  const path = 'foo-path';

  const defaultOptions: ConfigOptions = {
    name,
    path,
  };

  describe('File structure', () => {
    const tree = schematicRunner.runSchematic('generate', defaultOptions);
    [
      `/${path}/src/collection.json`,
      `/${path}/src/${name}/index.ts`,
      `/${path}/src/${name}/schema.d.ts`,
      `/${path}/src/${name}/schema.json`,
      `/${path}/sandbox/angular.json`,
      `/${path}/sandbox/src/app/app.module.ts`,
    ].forEach((path) => {
      it(`should create ${path}`, () => {
        return pathShouldExist(path, tree);
      });
    });
  });

  function pathShouldExist(path: string, tree: UnitTestTree) {
    return expect(tree.files.indexOf(path)).toBeGreaterThanOrEqual(
      0,
      `\nExpected ${path} to exist`
    );
  }
});
