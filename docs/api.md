# API

- [parenthesis](#parenthesis)
- [singleQuote](#singleQuote)
- [useNew](#usenew)
- [objectConstructor](#objectconstructor)
- [compact](#compact)
- [showFunctionBody](#showfunctionbody)
- [indentUsingTab](#indentusingtab)
- [indentSize](#indentsize)
- [constructor conversion](#constructor-conversion)
- [class conversion](#class-conversion)

## parenthesis

```javascript
import { uneval } from "@dmail/uneval"

const value = { foo: true, nested: { bar: true } }

uneval(value)
/*
{
  "foo": true,
  "nested": {
    "bar": true
  }
}
*/

uneval(value, { parenthesis: true })
/*
({
  "foo": true,
  "nested": ({
    "bar": true
  })
})
*/
```

## singleQuote

```javascript
import { uneval } from "@dmail/uneval"

const value = { foo: true }

uneval(value)
/*
{
  "foo": true
}
*/

uneval(value, { singleQuote: true })
/*
{
  'foo': true,
}
*/
```

## useNew

```javascript
import { uneval } from "@dmail/uneval"

uneval(new Date(10))
/*
Date(10)
*/

uneval(new Date(10), { useNew: true })
/*
new Date(10)
*/
```

## objectConstructor

```javascript
import { uneval } from "@dmail/uneval"

const value = {}

uneval(value)
/*
{}
*/

uneval(value, { objectConstructor: true })
/*
Object({})
*/
```

### Why there is no arrayConstructor option ?

Because `new Array()` is not equivalent to `[]` as shown below

```javascript
const arrayFromConstructorNotation = eval(`new Array(10)`)
arrayFromConstructorNotation[0] // undefined

const arrayFromLiteralNotation = eval(`[10]`)
arrayFromLiteralNotation[0] // 10
```

## compact

```javascript
import { uneval } from "@dmail/uneval"

const value = { foo: true, nested: { bar: true } }

uneval(value)
/*
{
  foo: true,
  nested: {
    bar: true
  }
}
*/

uneval(value, { compact: true })
/*
{foo: true, nested: {bar: true}}
*/
```

## showFunctionBody

```javascript
import { uneval } from "@dmail/uneval"

const fn = () => 10

uneval(fn)
/*
() => {/* hidden */}
*/

uneval(fn, { showFunctionBody: true })
/*
() => 10
*/
```

## indentUsingTab

```javascript
import { uneval } from "@dmail/uneval"

const value = { foo: true }

uneval(value)
/*
{
  foo: true
}
*/

uneval(value, { indentUsingTabs: true })
/*
{
  foo: true
}
*/
```

In the second call to uneval foo is indented using tabs, not space

## indentSize

```javascript
import { uneval } from "@dmail/uneval"

const value = { foo: true, nested: { bar: true } }

uneval(value)
/*
{
  foo: true,
  nested: {
    bar: true
  }
}
*/

uneval(value, { indentSize: 4 })
/*
{
    foo: true,
    nested: {
        bar: true
    }
}
*/
```

indentSize does nothing when indentUsingTab is true

## Constructor conversion

```javascript
import { uneval } from "@dmail/uneval"

const UserConstructor = function() {
  this.name = "dam"
}
UserConstructor.prototype.age = 10

uneval(new UserConstructor())
/*
UserConstructor({
  "name": "dam"
})
*/
```

## Class conversion

```javascript
import { uneval } from "@dmail/uneval"

class UserClass {
  constructor() {
    this.name = ""
  }
}
UserClass.prototype.age = 10

uneval(new UserClass())
/*
UserClass({
  "name": "dam"
})
*/
```
