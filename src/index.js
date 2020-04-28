'use strict';

import Parser from './parser.js';
import Util from './util.js';

export default new Parser([
    // Basic formating
    {
        name: 'Bold',
        regexp: /\[b\]([\s\S]*?)\[\/b\]/g,
        replace: '<b$class$style>$1</b>'
    },
    {
        name: 'Italics',
        regexp: /\[i\]([\s\S]*?)\[\/i\]/g,
        replace: '<i$class$style>$1</i>'
    },
    {
        name: 'Underline',
        regexp: /\[u\]([\s\S]*?)\[\/u\]/g,
        replace: '<u$class$style>$1</u>'
    },
    {
        name: 'Overline',
        regexp: /\[o\]([\s\S]*?)\[\/o\]/g,
        replace: '<o$class$style>$1</o>'
    },
    {
        name: 'Strikeout',
        regexp: /\[s\]([\s\S]*?)\[\/s\]/g,
        replace: '<s$class$style>$1</s>'
    },
    {
        name: 'Superscript',
        regexp: /\[sup\]([\s\S]*?)\[\/sup\]/g,
        replace: '<sup$class$style>$1</sup>'
    },
    {
        name: 'Subscript',
        regexp: /\[sub\]([\s\S]*?)\[\/sub\]/g,
        replace: '<sub$class$style>$1</sub>'
    },
    {
        name: 'Username',
        regexp: /@([^\s]+)/g,
        replace: '<b>@$1</b>'
    },
    {
        name: 'Spolier',
        regexp: /\[spoiler\]([\s\S]*?)\[\/spoiler\]/g,
        replace: '<span$class$style>$1</span>',
        class: 'spoiler'
    },
    {
        name: 'Inline code',
        regexp: /`(.*?)`/g,
        replace: '<code$class$style>$1</code>'
    },
    // Colors
    {
        name: 'Color',
        regexp: /\[color=(.*)\]([\s\S]*)\[\/color\]/g,
        before: (matches) => {
            return new Promise((res, rej) => {
                let reps = [];
                Util.so(matches, (mtch, i, next) => {
                    let groups = mtch.match(/\[color=(.*?)\](.[\s\S]*?)\[\/color\]/);
                    let props;
                    switch (groups[1]) {
                        case 'artist': // #F2AC08
                        case 'character': // #0A0
                        case 'copyright': // #D0D
                        case 'species': // #ED5D1F
                            props = `class="${groups[1]}"`
                        break;
                        default:
                            props = `style="color:${groups[1]}"`
                        break;
                    }
                    
                    reps.push(`<span ${props}>${groups[2]}</span>`);
                    next();
                })
                .then(() => {
                    res(reps);
                });
            });
        }
    },
    // Links
    {
        name: 'External link',
        regexp: /("(.*?)":)?(https?:\/\/([^\s]+))/g,
        before: (matches) => {
            return new Promise((res, rej) => {
                let reps = [];
                Util.so(matches, (mtch, i, next) => {
                    let groups = mtch.match(/("(.*?)":)?(https?:\/\/([^\s]+))/);
                    let displayText = groups[2] ? groups[2] : groups[3];

                    reps.push(`<a href="${groups[3]}"$class$style>${displayText}</a>`);
                    next();
                })
                .then(() => {
                    res(reps);
                });
            });
        }
    },
    {
        name: 'Wiki link',
        regexp: /\[\[([\w]+)?(#([\w]+))?(\|(.*))?\]\]/g,
        before: (matches) => {
            return new Promise((res, rej) => {
                try {
                    let reps = [];
                    Util.so(matches, (mtch, i, next) => {
                        let groups = mtch.match(/\[\[([\w]+)?(#([\w]+))?(\|(.*))?\]\]/);
                        let displayText = groups[6] ? groups[6] : groups[1];
                        
                        reps.push(`<a href="https://e621.net/wiki/show/${groups[1]}"$class$style>${displayText}</a>`);
                        next();
                    }).then(() => {
                        res(reps);
                    });
                } catch(e) { rej(e) }
            });
        }

    },
    {
        name: 'Tag link',
        regexp: /{{([\w]+)(\|(.*))?}}/g,
        before: (matches) => {
            return new Promise((res, rej) => {
                try {
                    let reps = [];
                    Util.so(matches, (mtch, i, next) => {
                        let groups = mtch.match(/{{([\w]+)(\|(.*))?}}/);
                        let displayText = groups[3] ? groups[3] : groups[1];
                        let tags = groups[3].replace(/ /g, '+');

                        reps.push(`<a href="https://e621.net/post/search?tags=${tags}"$class$style>${displayText}</a>`);
                        next();
                    }).then(() => {
                        res(reps);
                    });
                } catch(e) { rej(e) }
            })
        }
    },
    {
        name: 'Intern link',
        regexp: /(post|forum|comment|blip|pool|set|takedown|record|ticket|category)\s#(\d*[^\s\W])/g,
        before: (matches) => {
            return new Promise((res, rej) => {
                try {
                    let reps = [];
                    Util.so(matches, (mtch, i, next) => {
                        let groups = mtch.match(/(post|forum|comment|blip|pool|set|takedown|record|ticket|category)\s#(\d*[^\s\W])/);
                        let linkType = groups[1];
                        let linkId = groups[2];
                        let nextPath;

                        switch (linkType) {
                            case 'record':
                                nextPath = 'user_record/show/'
                                break;
                            case 'category':
                                nextPath = 'forum?category='
                                break;
                            default:
                                nextPath = `${linkType}/show/`
                                break;
                        }

                        reps.push(`<a href="https://e621.net/${nextPath}${linkId}"$class$style>${linkType} #${linkId}</a>`);
                        next();
                    }).then(() => {
                        res(reps);
                    })
                } catch(e) { rej(e) }
            })
        }
    },
    // Block formating
    {
        name: 'Quote',
        regexp: /\[quote\]([\s\S]*?)\[\/quote\]/g,
        replace: '<blockquote$class$style>$1</blockquote>'
    },
    {
        name: 'Code',
        regexp: /\[code\]([\s\S]*?)\[\/code\]/g,
        replace: '<pre$class$style>$1</pre>'
    },
    {
        name: 'Header',
        regexp: /^h(1|2|3|4|5|6)\.(.*)/gm,
        replace: '<h$1$class$style>$2</h$1>'
    },
    {
        name: 'Section',
        regexp: /\[section(,expanded)?(=(.*)?)?\]([\s\S]*?)\[\/section\]/g,
        before: (matches) => {
            return new Promise((res, rej) => {
                let reps = [];
                Util.so(matches, (mtch, i, next) => {
                    let groups = mtch.match(/\[section(,expanded)?(=(.*)?)?\]([\s\S]*?)\[\/section\]/),
                        isExpanded = !groups[1],
                        title = groups[3] ? groups[3] : 'Click to expand',
                        collapseTitle = groups[3] ? groups[3] : 'Click to collapse',
                        el = `<div class="section ${isExpanded ? 'expanded' : 'collapsed'}">\n`+
                        `<div class="section-collapse-title">${title}</div>\n`+
                        `<div class="section-collapsed-title">${collapseTitle}</div>\n`+
                        `<div class="section-content">${groups[4]}</div></div>`;

                    reps.push(el);
                    next();
                })
                .then(() => {
                    res(reps);
                })
            });
        }
    }
]);