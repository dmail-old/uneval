# uneval

[![npm package](https://img.shields.io/npm/v/@dmail/uneval.svg)](https://www.npmjs.com/package/@dmail/uneval)
[![build](https://travis-ci.com/dmail/uneval.svg?branch=master)](http://travis-ci.com/dmail/uneval)
[![codecov](https://codecov.io/gh/dmail/uneval/branch/master/graph/badge.svg)](https://codecov.io/gh/dmail/uneval)

> Overcome JSON.stringify limitations.

## What is `uneval`

`uneval` is a function turning a JavaScript value into a string that can be evaluated.<br />

It exists to overcome `JSON.stringify` limitations.<br />
But you should better use `JSON.stringify` and avoid using `uneval` at all.<br />
However, if some `JSON.stringify` limitations is a problem for you `uneval` might be what you're looking for.<br />

## `JSON.stringify` limitations

- Transforms regexp into `{}`

```js
JSON.stringify(/foo/) === "{}"
```

- Transforms `-0` into `0`

```js
JSON.stringify(-0) === "0"
```

- Transforms `NaN` into `null`

```js
JSON.stringify(NaN) === "null"
```

- Transforms `Infinity` into `null`

```js
JSON.stringify(Infinity) === "null"
```

- Does not support circular structure

```js
const value = {}
value.self = value
try {
  JSON.stringify(value)
} catch (error) {
  error.name === "TypeError"
}
```

- Transforms dates into strings

```js
JSON.stringify(new Date(0)) === `"1970-01-01T00:00:00.000Z"`
```

- Is not optimized for repetitive structure

```js
JSON.stringify(["very-long-string", "very-long-string"]) ===
  `["very-long-string","very-long-string"]`
```

`"very-long-string"` is repeated twice. It can becomes a waste if you use it to stringify very big structures.

- Ignores non enumerable properties

```js
JSON.stringify(Object.defineProperty({}, "foo", { enumerable: false })) === "{}"
```

## Example

Live browser example: https://dmail.github.io/uneval/#browser-example.

Live node example: https://dmail.github.io/uneval/#node-example
