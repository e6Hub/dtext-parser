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
```js
import DText from 'dtext-parser'

DText.parse('h1.DText header')
.then(console.log);
```
