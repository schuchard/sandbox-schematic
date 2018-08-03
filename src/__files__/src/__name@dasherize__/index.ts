import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';

interface ConfigOptions {}

export default function(options: ConfigOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return chain([addNgRxFiles(options)])(tree, context);
  };
}
