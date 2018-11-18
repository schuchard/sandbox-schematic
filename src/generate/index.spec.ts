// import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
// import { ConfigOptions } from '.';
// import { Tree } from '@angular-devkit/schematics/src/tree/interface';

// describe('Generate Schematic', () => {
//   const schematicRunner = new SchematicTestRunner(
//     '@schuchard/schematic-sandbox',
//     require.resolve('../collection.json')
//   );

//   const name = 'foo';
//   const author = 'foo-path';

//   const defaultOptions: ConfigOptions = {
//     name,
//     author,
//   };

//   describe('file structure', () => {
//     const tree = schematicRunner.runSchematic('generate', defaultOptions);
//     [
//       `/${path}/src/collection.json`,
//       `/${path}/src/${name}/index.ts`,
//       `/${path}/src/${name}/schema.d.ts`,
//       `/${path}/src/${name}/schema.json`,
//       `/${path}/sandbox/angular.json`,
//       `/${path}/sandbox/src/app/app.module.ts`,
//     ].forEach((path) => {
//       it(`should create ${path}`, () => {
//         return pathShouldExist(path, tree);
//       });
//     });
//   });

//   describe('name option', () => {
//     let tree: UnitTestTree;
//     let pkgJson: any;

//     beforeEach(() => {
//       tree = schematicRunner.runSchematic('generate', defaultOptions);
//       pkgJson = getFileContent(tree, `/${path}/package.json`);
//     });

//     it('should set the package.json name', () => {
//       expect(pkgJson.json.name).toEqual('foo');
//     });

//     it('should set the main path', () => {
//       expect(pkgJson.json.main).toEqual(`src/${name}/index.js`);
//     });

//     it('should set the schematic name in the scripts', () => {
//       expect(pkgJson.json.scripts.launch).toEqual(`cd sandbox && ng g ${name}:schematic-name`);
//       expect(pkgJson.json.scripts['link:schematic']).toEqual(
//         `yarn link && cd sandbox && yarn link ${name}`
//       );
//     });
//   });

//   describe('path option', () => {});

//   function pathShouldExist(path: string, tree: UnitTestTree) {
//     return expect(tree.files.indexOf(path)).toBeGreaterThanOrEqual(
//       0,
//       `\nExpected ${path} to exist`
//     );
//   }

//   function getFileContent(tree: Tree, path: string) {
//     const fileEntry = tree.get(path);

//     if (!fileEntry) {
//       throw new Error(`The file (${path}) does not exist.`);
//     }

//     const content = fileEntry.content.toString();

//     return {
//       string: content,
//       json: JSON.parse(content),
//     };
//   }
// });
