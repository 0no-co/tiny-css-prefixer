# `tiny-css-prefixer`

**Bare essentials CSS prefixing helpers in less than 1KB 🌈**

[![version](https://img.shields.io/npm/v/tiny-css-prefixer)](https://www.npmjs.com/package/tiny-css-prefixer)
[![gzip size](https://img.badgesize.io/https://unpkg.com/tiny-css-prefixer@latest/dist/tiny-css-prefixer.es.js?compression=gzip)](https://unpkg.com/tiny-css-prefixer)

Currently supports prefixing properties for most browsers as it makes sense.
[See `SUPPORT.md` for more information on which prefixes and transformations have been omitted.](./SUPPORT.md)

The API is fairly straightforward and only consists of two functions, `prefixProperty` and `prefixValue`.

```js
prefixProperty('margin'); // 0b000
prefixProperty('appearance'); // 0b110

prefixValue('color', 'palevioletred'); // 'palevioletred'
prefixValue('position', 'sticky'); // '-webkit-sticky, sticky'
```

`prefixProperty` returns a bitmap depending on which prefix should be
applied:

- `0b001` stands for `-ms-`
- `0b010` stands for `-moz-`
- `0b100` stands for `-webkit`

These are combined using a binary OR, so an example usage of the
`prefixProperty` helper may look like the following:

```js
const prefix = (prop, value) => {
  const flag = prefixProperty(prop);
  let css = `${prop}: ${value};\n`;
  if (flag & 0b001) css += `-ms-${css}`;
  if (flag & 0b010) css += `-moz-${css}`;
  if (flag & 0b100) css += `-webkit-${css}`;
  return css;
};
```

Additionally `prefixValue` can accept full declarations to avoid
having to apply it before concatenation, which can be useful in case
you're trying to minimise string operations:

```js
const declaration = 'position: sticky';
prefixValue(declaration, declaration); // 'position: -webkit-sticky, sticky'
```
