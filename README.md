# `tiny-css-prefixer`

**Bare essentials CSS prefixing helpers in less than 1KB 🌈**

[![version](https://img.shields.io/npm/v/tiny-css-prefixer)](https://www.npmjs.com/package/tiny-css-prefixer)
[![gzip size](https://img.badgesize.io/https://unpkg.com/tiny-css-prefixer@latest/dist/tiny-css-prefixer.es.js?compression=gzip)](https://unpkg.com/tiny-css-prefixer)

Currently supports prefixing properties for most browsers as it makes sense.
[See `SUPPORT.md` for more information on which prefixes and transformations have been omitted.](./SUPPORT.md)

The API is fairly straightforward and only consists of two functions, `prefixProperty` and `prefixValue`.

```js
prefixProperty('margin'); // ['margin']
prefixProperty('appearance'); // ['appearance', '-moz-appearance', '-webkit-appearance']

prefixValue('color', 'palevioletred'); // 'palevioletred'
prefixValue('position', 'sticky'); // '-webkit-sticky, sticky'
```
