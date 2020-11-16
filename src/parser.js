'use strict';

const Util = require('./util');

class ModuleError extends Error {
  constructor(...options) {
    super(...options);
    if (Error.captureStackTrace) Error.captureStackTrace(this, ModuleError);
    this.name = 'ModuleError';
  }
}

class Module {
  constructor(moduleObject) {
    const name = moduleObject.name,
      regexp = moduleObject.regexp,
      replace = moduleObject.replace,
      before = moduleObject.before ? moduleObject.before : null,
      attrs = moduleObject.attrs ? moduleObject.attrs : [];
    // Validate props
    if (typeof name !== 'string') throw ModuleError(`name must be a string, got ${typeof name}`);
    if (!(regexp instanceof RegExp)) throw ModuleError(`regExp is not valid`);
    if (replace && typeof replace !== 'string') throw ModuleError(`replace must be a string, got ${typeof replace}`);
    if (before && typeof before !== 'function') throw ModuleError(`before operation must be a function, got ${typeof before}`);
    if (attrs && !Array.isArray(attrs)) throw ModuleError(`attributes must be an array, got ${typeof before}`);

    return { name, regexp, replace, before, attrs };
  }
}

class Parser {
  /**
   * Parser's main constructor
   * @param {Array} initialModules 
   */
  constructor(initialModules) {
    this.modules = [];
    this.debug = false;
    this.format = false;

    typeof initialModules === 'object'
      ? this.addModules(initialModules)
      : () => { throw new Error('Invalid module statement') }
  }

  /**
   * Parse current DText string to HTML
   * @param {String} string String to parse
   */
  async parse(string) {
    this.newStr;
    this.newLines = string.split(/\n/);

    await Util.each(this.newLines, async (line, lineIndex) => {
      await Util.each(this.modules, async (mod, modIndex) => {
        let matches = this.newLines[lineIndex].match(mod.regexp),
          toReplace = [],
          parseStr = () => {
            try {
              Util.each(matches, (mtch, i) => {
                // Replace attrs
                const attrs = mod.attrs.map(a => `${a.name}${a.value ? `="${a.value}"` : ''}`);
                if (!attrs.length) toReplace[i] = toReplace[i].replace('%a', '');
                else toReplace[i] = toReplace[i].replace('%a', ` ${attrs.join(' ')}`);

                if (this.debug) console.log(`Replace: ${this.newLines[lineIndex]} → ${this.newLines[lineIndex].replace(mtch, toReplace[i])}`);
                this.newLines[lineIndex] = this.newLines[lineIndex].replace(mtch, toReplace[i]);
              });
            } catch (err) {
              throw err;
            }
          }

        if (!matches) return;

        // Before operation
        if (mod.before) {
          await mod.before(matches).then(async (repls) => {
            await Util.each(repls, (r, i) => {
              toReplace.push(r);
            })
            parseStr(matches, toReplace)
          }).catch((err) => { throw err });
          return modIndex;
        }

        // Common operation
        if (this.debug) console.log({ matches });
        await Util.each(matches, (mtch) => {
          try {
            toReplace.push(mtch.replace(mod.regexp, mod.replace))
          } catch (err) {
            throw err;
          }
        });
        parseStr(matches, toReplace);
      });
    });

    if (this.debug) console.log(this.newLines);
    this.newStr = this.newLines.join(this.format ? '\n' : '');

    return this.newStr;
  }

  /**
   * Add modules to the class
   * @param {Array} modules 
   */
  addModules(modules) {
    const type = typeof modules;
    if (type !== 'object' && !Array.isArray(modules)) throw new Error(`Array expected but found ${type}`);

    modules.forEach((m) => {
      this.modules.push(new Module(m));
    });
  }

  /**
   * Set options to modules
   * @param {Object} configs
   */
  options(configs) {
    Object.keys(configs).forEach(moduleName => {
      let config = configs[moduleName];
      let indx = this.modules.findIndex(m => m.name == moduleName);
      if (indx < 0) return; // stop function if target module doesn't exists
      if (Array.isArray(config.attrs)) this.modules[indx].attrs = config.attrs;
    })
  }
}

module.exports = Parser;