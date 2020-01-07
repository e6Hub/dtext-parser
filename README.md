> :warning: WIP

# :u6e80: DText parser
DText is the e621's markdown system, it's based on many languages like BBCode, MediaWiki, Textile, etc.

## :package: Install
```
yarn add dtext-parser
```
or
```
npm install dtext-parser -s
```

## :wrench: Usage
### Quick start
```js
import DText from 'dtext-parser'

DText.parse('h1.DText header')
.then(console.log);
```

### Config
Follow the name of the modules (codes) e.g. Bold, Italics, Code, External link, etc. then set your own class or style.
```js
import DText from 'dtext-parser'

DText.options({
    "External link": {
        style: "color:red; font-size:14pt"
        class: "external-link"
    }
});

DText.parse('https://github.com').then(console.log);
// <a href="https://github.com" class="external-link" style="color:red; font-size:14pt">https://github.com</a>
```
