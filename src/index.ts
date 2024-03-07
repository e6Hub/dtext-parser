import Parser from './parser';
import Util from './util';

export default new Parser([
  // Basic formating
  {
    name: 'Bold',
    regexp: /\[b\]([\s\S]*?)\[\/b\]/g,
    replace: '<b%a>$1</b>'
  },
  {
    name: 'Italics',
    regexp: /\[i\]([\s\S]*?)\[\/i\]/g,
    replace: '<i%a>$1</i>'
  },
  {
    name: 'Underline',
    regexp: /\[u\]([\s\S]*?)\[\/u\]/g,
    replace: '<u%a>$1</u>'
  },
  {
    name: 'Overline',
    regexp: /\[o\]([\s\S]*?)\[\/o\]/g,
    replace: '<o%a>$1</o>'
  },
  {
    name: 'Strikeout',
    regexp: /\[s\]([\s\S]*?)\[\/s\]/g,
    replace: '<s%a>$1</s>'
  },
  {
    name: 'Superscript',
    regexp: /\[sup\]([\s\S]*?)\[\/sup\]/g,
    replace: '<sup%a>$1</sup>'
  },
  {
    name: 'Subscript',
    regexp: /\[sub\]([\s\S]*?)\[\/sub\]/g,
    replace: '<sub%a>$1</sub>'
  },
  {
    name: 'Username',
    regexp: /@([^\s]+)/g,
    replace: '<b%a>@$1</b>'
  },
  {
    name: 'Spolier',
    regexp: /\[spoiler\]([\s\S]*?)\[\/spoiler\]/g,
    replace: '<span%a>$1</span>',
    attrs: [
      {
        name: 'class',
        value: 'spoiler'
      }
    ]
  },
  {
    name: 'Inline code',
    regexp: /`(.*?)`/g,
    replace: '<code%a>$1</code>'
  },
  // Colors
  {
    name: 'Color',
    regexp: /\[color=(.*?)\](.*?)\[\/color\]/g,
    before: async (matches: RegExpMatchArray) => {
      let reps:string[] = [];
      await Util.each(matches, (mtch, i) => {
        let groups = mtch.match(/\[color=(.*?)\](.*?)\[\/color\]/);
        let props;
        if (groups === null) return [];
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
      })
      return reps;
    }
  },
  // Links
  {
    name: 'External link',
    regexp: /("(.*?)":)?(http(s)?:\/\/([\S]*)[^)])/g,
    before: async (matches: RegExpMatchArray) => {
      let reps: string[] = [];
      await Util.each(matches, (mtch, i) => {
        let groups = mtch.match(/("(.*?)":)?(http(s)?:\/\/([\S]*)[^)])/);
        if (groups === null) return [];
        let displayText = groups[2] ? groups[2] : groups[3];
        reps.push(`<a href="${groups[3]}"%a>${displayText}</a>`);
      })
      return reps;
    }
  },
  {
    name: 'Wiki link',
    regexp: /\[\[(.*?)?(#(.*))?(\|(.*?))?\]\]/g,
    before: async (matches: RegExpMatchArray) => {
      let reps: string[] = [];
      await Util.each(matches, (mtch, i) => {
        let groups = mtch.match(/\[\[(.*?)?(#(.*))?(\|(.*?))?\]\]/);
        if (groups === null) return [];
        let finalUrl = `https://e621.net/wiki_pages/${groups[1]}${groups[2] ? groups[2] : ''}`;
        let displayText = groups[5] ? groups[5] : `${groups[1]}${groups[2] ? groups[2] : ''}`;
        reps.push(`<a href="${finalUrl}"%a>${displayText}</a>`);
      })
      return reps;
    }
  },
  {
    name: 'Tag link',
    regexp: /{{(.*?)(\|(.*))?}}/g,
    before: async (matches: RegExpMatchArray) => {
      let reps: string[] = [];
      await Util.each(matches, (mtch, i) => {
        let groups = mtch.match(/{{(.*?)(\|(.*))?}}/);
        if (groups === null) return [];
        let displayText = groups[3] ? groups[3] : groups[1];
        let tags = groups[1].replace(/ /g, '+');
        reps.push(`<a href="https://e621.net/posts?tags=${tags}"%a>${displayText}</a>`);
      })
      return reps;
    }
  },
  {
    name: 'Intern link',
    regexp: /(post|forum|comment|blip|pool|set|takedown|record|ticket|category)\s#(\d*[^\s\W])/g,
    before: async (matches: RegExpMatchArray) => {
      let reps: string[] = [];
      await Util.each(matches, (mtch, i) => {
        let groups = mtch.match(/(post|forum|comment|blip|pool|set|takedown|record|ticket)\s#(\d*[^\s\W])/);
        if (groups === null) return [];
        let linkType = groups[1];
        let linkId = groups[2];
        let nextPath = '';
        switch (linkType) {
          case 'post':
            nextPath = 'posts'
            break;
          case 'forum':
            nextPath = 'forum_posts'
            break;
          case 'comment':
            nextPath = 'comments'
            break;
          case 'blips':
            nextPath = 'blips'
            break;
          case 'pool':
            nextPath = 'posts'
            break;
          case 'sets':
            nextPath = 'sets'
            break;
          case 'takedown':
            nextPath = 'takedowns'
            break;
          case 'record':
            nextPath = 'user_feedbacks'
            break;
          case 'ticket':
            nextPath = 'tickets'
            break;
        }
        reps.push(`<a href="https://e621.net/${nextPath}/${linkId}"%a>${linkType} #${linkId}</a>`);
      })
      return reps;
    }
  },
  // Block formating
  {
    name: 'Quote',
    regexp: /\[quote\]([\s\S]*?)\[\/quote\]/g,
    replace: '<blockquote%a>$1</blockquote>'
  },
  {
    name: 'Code',
    regexp: /\[code\]([\s\S]*?)\[\/code\]/g,
    replace: '<pre%a>$1</pre>'
  },
  {
    name: 'Header',
    regexp: /^h(1|2|3|4|5|6)\.(.*)/gm,
    replace: '<h$1%a>$2</h$1>'
  },
  {
    name: 'Section',
    regexp: /\[section(,expanded)?(=(.*)?)?\](.*[\S]+)?/g,
    before: async (matches: RegExpMatchArray) => {
      let reps: string[] = [];
      await Util.each(matches, (mtch, i) => {
        let groups = mtch.match(/\[section(,expanded)?(=(.*)?)?\]([\s\S]*?)/);
        if (groups === null) return [];
        let isExpanded = !groups[1];
        let title = groups[3] ? groups[3] : '';
        let collapseTitle = groups[3] ? groups[3] : '';
        let el = `<section class="section ${isExpanded ? 'expanded' : 'collapsed'}">` +
            `<div class="section-collapse-title">${title}</div>` +
            `<div class="section-collapsed-title">${collapseTitle}</div>` +
            `<div class="section-content">${groups[4]}`;
        reps.push(el);
      })
      return reps;
    }
  },
  {
    name: 'Section End',
    regexp: /\[\/section]/g,
    replace: '\n</div></section>'
  },
  {
    name: 'Paragraph',
    regexp: /^(?!\[(.*?)]|\<(.*?)>)(.*[\S]+)/g,
    replace: '<p%a>$3</p>'
  }
]);
