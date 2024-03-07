import dtext from '../src';

test('parse scenario Paragraphs: multiline', () => {
  return dtext.parse('Hello foo!\nHello bar!')
    .then((result:string) => {
      expect(result).toBe
        ('<p>Hello foo!</p>\n<p>Hello bar!</p>');
    });
});

test('parse scenario Paragraphs: multiline but ignore format', () => {
  return dtext.parse('Hello foo!\nHello bar!', { ignoreFormat: true })
    .then((result:string) => {
      expect(result).toBe
        ('<p>Hello foo!</p><p>Hello bar!</p>');
    });
});

test('parse scenario Link: skip parentheses', () => {
  return dtext.parse('(https://github.com)')
    .then((result:string) => {
      expect(result).toBe
        ('<p>(<a href="https://github.com">https://github.com</a>)</p>');
    });
});

test('parse scenario Section', () => {
  return dtext.parse('[section=Section title]\nh1.Some cool title\nRemake of post #1234[/section]')
    .then((result:string) => {
      expect(result).toBe
        ('<section class="section expanded"><div class="section-collapse-title">Section title</div><div class="section-collapsed-title">Section title</div><div class="section-content"><h1>Some cool title</h1><p>Remake of <a href="https://e621.net/posts/1234">post #1234</a></p>\n</div></section>');
    });
});
