import {
  Rule,
  SchematicContext,
  Tree,
  chain
} from '@angular-devkit/schematics';

interface ConfigOptions { }

// You don't have to export the function as default
// and you can have more than one rule factory per file.
export default function(options: ConfigOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([logger(options)])(host, context);
  };
}

function logger(options: ConfigOptions): Rule {
  return (host: Tree): Tree => {
    console.log('schematics')
    return host;
  }
}