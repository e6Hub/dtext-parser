import dtext from '../src';

test('parse format Bold', () => {
  return dtext.parse('[b]Test[/b]')
    .then((result:string) => {
      expect(result).toBe
        ('<b>Test</b>');
    });
});

test('parse format Italics', () => {
  return dtext.parse('[i]Test[/i]')
    .then((result:string) => {
      expect(result).toBe
        ('<i>Test</i>');
    });
});

test('parse format Underline', () => {
  return dtext.parse('[u]Test[/u]')
    .then((result:string) => {
      expect(result).toBe
        ('<u>Test</u>');
    });
});

test('parse format Overline', () => {
  return dtext.parse('[o]Test[/o]')
    .then((result:string) => {
      expect(result).toBe
        ('<o>Test</o>');
    });
});

test('parse format Strikeout', () => {
  return dtext.parse('[s]Test[/s]')
    .then((result:string) => {
      expect(result).toBe
        ('<s>Test</s>');
    });
});

test('parse format Superscript', () => {
  return dtext.parse('[sup]Test[/sup]')
    .then((result:string) => {
      expect(result).toBe
        ('<sup>Test</sup>');
    });
});

test('parse format Subscript', () => {
  return dtext.parse('[sub]Test[/sub]')
    .then((result:string) => {
      expect(result).toBe
        ('<sub>Test</sub>');
    });
});

test('parse format Username', () => {
  return dtext.parse('@Test')
    .then((result:string) => {
      expect(result).toBe
        ('<b>@Test</b>');
    });
});

test('parse format Spoiler', () => {
  return dtext.parse('[spoiler]Test[/spoiler]')
    .then((result:string) => {
      expect(result).toBe
        ('<span class="spoiler">Test</span>');
    });
});

test('parse format Code', () => {
  return dtext.parse('`Test`')
    .then((result:string) => {
      expect(result).toBe
        ('<code>Test</code>');
    });
});

test('parse format Inline code', () => {
  return dtext.parse('`Test`')
    .then((result:string) => {
      expect(result).toBe
        ('<code>Test</code>');
    });
});

test('parse format Color', () => {
  return dtext.parse('[color=#f00]Test[/color]')
    .then((result:string) => {
      expect(result).toBe
        ('<span style="color:#f00">Test</span>');
    });
});

test('parse format External link', () => {
  return dtext.parse('https://google.com')
    .then((result:string) => {
      expect(result).toBe
        ('<a href="https://google.com">https://google.com</a>');
    });
});

test('parse format Wiki link', () => {
  return dtext.parse('[[test]]')
    .then((result:string) => {
      expect(result).toBe
        ('<a href="https://e621.net/wiki_pages/test">test</a>');
    });
});

test('parse format Tag link', () => {
  return dtext.parse('{{test}}')
    .then((result:string) => {
      expect(result).toBe
        ('<a href="https://e621.net/posts?tags=test">test</a>');
    });
});

test('parse format Intern link', () => {
  return dtext.parse('post #1234')
    .then((result:string) => {
      expect(result).toBe
        ('<a href="https://e621.net/posts/1234">post #1234</a>');
    });
});

test('parse format Quote', () => {
  return dtext.parse('[quote]Test[/quote]')
    .then((result:string) => {
      expect(result).toBe
        ('<blockquote>Test</blockquote>');
    });
});

test('parse format Code', () => {
  return dtext.parse('[code]Test[/code]')
    .then((result:string) => {
      expect(result).toBe
        ('<pre>Test</pre>');
    });
});

test('parse format Header', () => {
  return dtext.parse('h1.Test')
    .then((result:string) => {
      expect(result).toBe
        ('<h1>Test</h1>');
    });
});

test('parse format Section', () => {
  return dtext.parse('[section,expanded="Test"]Test[/section]')
    .then((result:string) => {
      expect(result).toBe
        ('<section class="section collapsed"><div class="section-collapse-title">"Test"]Test[/section</div><div class="section-collapsed-title">"Test"]Test[/section</div><div class="section-content">');
    });
});
