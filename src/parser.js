'use strict';

import Util from './util.js';

export default class Parser {
    /**
     * Parser's main constructor
     * @param {Array} initialModules 
     */
    constructor(initialModules) {
        this.modules = [];

        typeof initialModules === 'object'
        ? this.addModules(initialModules)
        : () => { throw new Error('Invalid module statement') }
    }

    /**
     * Parse current DText string to HTML
     * @param {String} string
     */
    parse(string) {
        return new Promise(async (res, rej) => {
            this.newStr = string;
            await Util.each(this.modules, async (m, i) => {
                let matches = this.newStr.match(m.regexp),
                    toReplace = [],
                    parseStr = () => {
                    try {
                        Util.each(matches, (mtch, i) => {
                            m.class
                            ? toReplace[i] = toReplace[i].replace(/\$class/g, ` class="${m.class}"`)
                            : toReplace[i] = toReplace[i].replace(/\$class/g, '');

                            m.style
                            ? toReplace[i] = toReplace[i].replace(/\$style/g, ` style="${m.class}"`)
                            : toReplace[i] = toReplace[i].replace(/\$style/g, '');

                            this.newStr = this.newStr.replace(mtch, toReplace[i]);
                        })
                    } catch (e) {
                        console.error(e)
                    }
                }
    
                if (!matches) return;
    
                if (m.before) {
                    await m.before(matches).then(async (repls) => {
                        await Util.each(repls, (r, i) => {
                            toReplace.push(r);
                        })
                        parseStr(matches, toReplace)
                    }).catch(console.error);
                    return;
                }
                await Util.each(matches, (mtch, i) => { toReplace.push(mtch.replace(m.regexp, m.replace)); })
                parseStr(matches, toReplace)
            });
            res(this.newStr);
        });
    }

    /**
     * Add modules to the class
     * @param {Array} modules 
     */
    addModules(modules) {
        const type = typeof modules;
        if (type !== 'object' && !Array.isArray(modules)) throw new Error(`Array expected but found ${type}`);

        modules.forEach((m) => {
            this.modules.push( // In arrow functions "this" statement is the current class.
                {
                    name: m.name,
                    regexp: m.regexp,
                    replace: m.replace,
                    before: m.before ? m.before : null,
                    class: m.class ? m.class : null,
                    style: m.style ? m.style : null
                }
            );
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
            config.style ? this.modules[indx].style = config.style : null
            config.class ? this.modules[indx].class = config.class : null
        })
    }
}