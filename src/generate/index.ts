import {
  Rule,
  SchematicContext,
  Tree,
  move,
  mergeWith,
  apply,
  url,
  branchAndMerge,
  template
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

interface ConfigOptions {
  path: string;
  dot: string;
  name: string;
}

export default function(options: ConfigOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.dot = '.';
    options.name = 'myScheme';

    const templateSource = apply(url('./__files__'), [
      template({
        ...strings,
        ...options
      }),
      move(options.path || './testDir')
    ]);

    return branchAndMerge(mergeWith(templateSource));
  };
}
