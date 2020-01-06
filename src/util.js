'use strict';

export default new class Util {
    /**
     * a forEach function with callback when the forEach ends
     * @param {Array} a 
     * @param {Function} forEachCallback 
     * @param {Boolean} debug
     */
    so(a, forEachCallback) {
        return new Promise((res, rej) => {
            try {
                let count = 0;
                if (!Array.isArray(a)) throw new Error('Array expected');
                a.forEach((item, i) => {
                    forEachCallback(item, i, () => {
                        count++;
                        if (count === a.length) {
                            res();
                        }
                    });
                });
            } catch(err) { rej(err) }
        });
    }
}