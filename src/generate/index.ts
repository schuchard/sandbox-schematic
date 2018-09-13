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
import { strings, basename, normalize } from '@angular-devkit/core';

interface ConfigOptions {
  dot: string;
  path: string;
  name: string;
}

export default function(options: ConfigOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const parsedName = basename(normalize(options.name));

    options.dot = '.';
    options.name = parsedName;

    const templateSource = apply(url('./__files__'), [
      template({
        ...strings,
        ...options
      }),
      move(options.path)
    ]);

    return branchAndMerge(mergeWith(templateSource));
  };
}
