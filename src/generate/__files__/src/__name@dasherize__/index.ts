import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

interface ConfigOptions {}

// You don't have to export the function as default
// and you can have more than one rule factory per file.
export default function(options: ConfigOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    tree.create('hello.md', 'world');

    return tree;
  };
}
