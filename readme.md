# uneval

[![npm](https://badge.fury.io/js/%40dmail%2Funeval.svg)](https://badge.fury.io/js/%40dmail%2Funeval)
[![build](https://travis-ci.com/dmail/uneval.svg?branch=master)](http://travis-ci.com/dmail/uneval)
[![codecov](https://codecov.io/gh/dmail/uneval/branch/master/graph/badge.svg)](https://codecov.io/gh/dmail/uneval)

> Convert a value into a source string

## Installing / Getting started

```shell
npm install @dmail/uneval
```

```javascript
import { uneval } from "@dmail/uneval"

console.log(
  uneval({
    array: [],
    boolean: true,
    date: new Date(7),
    function: (a) => a,
    null: null,
    number: 10,
    regExp: /ok/,
    string: "dmail",
    symbol: Symbol("foo"),
    typeError: new TypeError("cannot read property 0 of undefined"),
    undefined: undefined,
  }),
)
```

Executing above code logs in the console

```javascript
{
  "array": [],
  "boolean": true,
  "date": Date(7),
  "function": () => {/* hidden */},
  "null": null,
  "number": 10,
  "regExp": /ok/
  "string": "dmail",
  "symbol": Symbol("foo"),
  "typeError": TypeError("cannot ready property 0 of undefined"),
  "undefined": undefined,
}
```

## Style guide

Prettier and eslint are used to ensure code style and format

## API

- [api documentation](./doc/api.md)

## Licensing

MIT
