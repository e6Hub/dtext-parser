const dtext = require('../');

test('parse html attributes', () => {
  dtext.options({
    "External link": {
      attrs: [
        {
          name: 'style',
          value: 'color: red;'
        },
        {
          name: 'class',
          value: 'extern'
        }
      ]
    }
  });

  return dtext.parse('https://google.com').then((result) => {
    expect(result).toBe
      ('<a href="https://google.com" style="color: red;" class="extern">https://google.com</a>');
  });
});