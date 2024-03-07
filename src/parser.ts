import Util from './util';

interface ModuleOptions {
  name: string;
  regexp: RegExp;
  replace?: string;
  before?: (matches: RegExpMatchArray) => Promise<string[]>;
  attrs?: any[];
}

interface ParseOptions {
  ignoreFormat?: boolean;
  debug?: boolean;
}

class ModuleError extends Error {
  constructor(message: string) {
    super(message);
    if (Error.captureStackTrace) Error.captureStackTrace(this, ModuleError);
    this.name = 'ModuleError';
  }
}

class Module {
  name: string;
  regexp: RegExp;
  replace?: string;
  before?: (matches: RegExpMatchArray) => Promise<string[]>;
  attrs?: any[];

  constructor(moduleObject: ModuleOptions) {
    this.name = moduleObject.name;
    this.regexp = moduleObject.regexp;
    if (moduleObject.replace) this.replace = moduleObject.replace;
    this.before = moduleObject.before || undefined;
    this.attrs = moduleObject.attrs ? moduleObject.attrs : [];
    // Validate props
    if (typeof this.name !== 'string') throw new ModuleError(`name must be a string, got ${typeof name}`);
    if (!(this.regexp instanceof RegExp)) throw new ModuleError(`regExp is not valid`);
    if (this.replace && typeof this.replace !== 'string') throw new ModuleError(`replace must be a string, got ${typeof this.replace}`);
    if (this.before && typeof this.before !== 'function') throw new ModuleError(`before operation must be a function, got ${typeof this.before}`);
    if (this.attrs && !Array.isArray(this.attrs)) throw new ModuleError(`attributes must be an array, got ${typeof this.before}`);
  }
}

class Parser {
  modules: Module[];
  debug: boolean;
  ignoreFormat: boolean;
  /**
   * Parser's main constructor
   */
  constructor(initialModules: Module[]) {
    this.modules = [];
    this.debug = false;
    this.ignoreFormat = false;

    typeof initialModules === 'object'
      ? this.addModules(initialModules)
      : () => { throw new Error('Invalid module statement') }
  }

  /**
   * Parse current DText string to HTML
   */
  async parse(string: string, options?: ParseOptions) {
    if (options) {
      this.debug = options.debug || false;
      this.ignoreFormat = options.ignoreFormat || false;
    }
    let newStr = '';
    let newLines = string.split(/\n/);

    await Util.each(newLines, async (_, lineIndex) => {
      await Util.each(this.modules, async (mod, modIndex) => {
        let matches = newLines[lineIndex].match(mod.regexp);
        let toReplace: string[] = [];
        if (matches === null) return false;
        const parseStr = (localMatches: RegExpMatchArray, localToReplace: string[]) => {
            try {
              Util.each(localMatches, (mtch, i) => {
                // Replace attrs
                if (mod.attrs) {
                  const attrs = mod.attrs.map(a => `${a.name}${a.value ? `="${a.value}"` : ''}`);
                  if (!attrs.length) localToReplace[i] = localToReplace[i].replace('%a', '');
                  else localToReplace[i] = localToReplace[i].replace('%a', ` ${attrs.join(' ')}`);
                }
                
                if (this.debug) console.log(`Replace: ${newLines[lineIndex]} → ${newLines[lineIndex].replace(mtch, localToReplace[i])}`);
                newLines[lineIndex] = newLines[lineIndex].replace(mtch, localToReplace[i]);
              });
            } catch (err) {
              throw err;
            }
          }

        if (!matches) return;

        // Before operation
        if (mod.before) {
          await mod.before(matches).then(async (repls) => {
            if (!matches) return;
            await Util.each(repls, (r) => {
              toReplace.push(r);
            })
            parseStr(matches, toReplace)
          }).catch((err) => { throw err });
          return modIndex;
        }

        // Common operation
        if (this.debug) console.log('Matches:', { matches });
        await Util.each(matches, (mtch) => {
          if (!mod.replace) return;
          toReplace.push(
            mtch.replace(mod.regexp, mod.replace)
          )
        });
        parseStr(matches, toReplace);
      });
    });

    if (this.debug) console.log(newLines);
    newStr = newLines.join(this.ignoreFormat ? '' : '\n');

    return newStr;
  }

  /**
   * Add modules to the class
   */
  addModules(modules: ModuleOptions[]) {
    const type = typeof modules;
    if (type !== 'object' && !Array.isArray(modules)) throw new Error(`Array expected but found ${type}`);

    modules.forEach((m) => {
      this.modules.push(new Module(m));
    });
  }

  /**
   * Set options to modules
   */
  options(configs: Record<string, Partial<ModuleOptions>>) {
    Object.keys(configs).forEach(moduleName => {
      let config = configs[moduleName];
      let indx = this.modules.findIndex(m => m.name == moduleName);
      if (indx < 0) return; // stop function if target module doesn't exists
      if (Array.isArray(config.attrs)) this.modules[indx].attrs = config.attrs;
    })
  }
}

export default Parser;
