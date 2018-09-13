import {
  Rule,
  SchematicContext,
  Tree,
  move,
  mergeWith,
  apply,
  url,
  branchAndMerge,
  template,
  SchematicsException,
} from '@angular-devkit/schematics';
import { strings, basename, normalize, dirname, join, Path } from '@angular-devkit/core';

interface ConfigOptions {
  dot: string;
  path: string;
  name: string;
}

export default function(options: ConfigOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.name) {
      throw new SchematicsException('Option (name) is required.');
    }

    const parsedName = basename(normalize(options.name));
    const namePath = dirname(join(normalize(options.path || './'), options.name) as Path);

    options.dot = '.';
    options.name = parsedName;

    const templateSource = apply(url('./__files__'), [
      template({
        ...strings,
        ...options,
      }),
      move(namePath),
    ]);

    return branchAndMerge(mergeWith(templateSource));
  };
}
