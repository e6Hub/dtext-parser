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
        return new Promise((res, rej) => {
            let newStr = string;
            Util.so(this.modules, (m, i, nextModule) => {
                let matches = string.match(m.regexp),
                    toReplace = [];
    
                if (!matches) return nextModule(); 
    
                if (m.before) m.before(matches).then((repls) => {
                    Util.so(repls, (r, i, next) => {
                        toReplace.push(r);
                        next();
                    }).then(parseStr(matches, toReplace)).catch(console.error);
                });
                else Util.so(matches, (mtch, i, next) => { toReplace.push(mtch.replace(m.regexp, m.replace)); next(); })
                .then(parseStr(matches, toReplace))
                .catch(console.error);
                
                function parseStr(matches, toReplace) {
                    Util.so(matches, (mtch, i, next) => {
                        newStr = newStr.replace(mtch, toReplace[i]);
                        next();
                    }).then(nextModule).catch(console.error);
                }
            }).then(() => {
                res(newStr);
            });
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
                    before: m.before ? m.before : null
                }
            );
        });
    }
}