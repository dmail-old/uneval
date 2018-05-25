# uneval

[![npm](https://badge.fury.io/js/%40dmail%2Funeval.svg)](https://badge.fury.io/js/%40dmail%2Funeval)
[![build](https://travis-ci.org/dmail/uneval.svg?branch=master)](http://travis-ci.org/dmail/uneval)
[![codecov](https://codecov.io/gh/dmail/uneval/branch/master/graph/badge.svg)](https://codecov.io/gh/dmail/uneval)

> Turn JavaScript values into source strings

## Installing / Getting started

```shell
npm install @dmail/uneval
```

```javascript
import { uneval } from "@dmail/uneval"

console.log(
  uneval({
    string: "dmail",
    number: 10,
    date: new Date(),
    regExp: /ok/,
  }),
)
```

Executing above code logs in the console

```javascript
{
  "string": "dmail",
  "number": 10,
  "date": Date(1527257307798),
  "regExp": /ok/
}
```

## Style guide

Prettier and eslint are used to ensure code style and format

## API

* [api documentation](./docs/api.md)

## Licensing

MIT
