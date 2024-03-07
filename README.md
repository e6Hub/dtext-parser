# DText parser
DText is the e621's markdown system, it's based on many languages like BBCode, MediaWiki, Textile, etc. This module parses DText to HTML.

## 📦 Install
```
npm i dtext-parser
```
or
```
pnpm add dtext-parser
```

## 🧪 Usage
### ⚡ Quick start
```js
const DText = require('dtext-parser');

DText.parse('h1.DText header')
  .then(console.log); // <h1>DText header</h1>
```

### ⚙ Config
Follow the name of the modules (codes) e.g. Bold, Italics, Code, External link, etc. then set your own class or style.
```js
const DText = require('dtext-parser');

DText.options({
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
});

DText.parse('https://github.com').then(console.log);
// <a href="https://github.com" class="extern" style="color: red;">https://github.com</a>
```

## 🧑‍💻 Build

1. Assuming you've already cloned this repo, install the packages with `pnpm i`.
2. Source code directory is `src/`, test unit files are located at `tests/`.
3. For unit testing, you can use `pnpm test`, for individual or playground testing, you can use the scripts of `playground/` directory.
