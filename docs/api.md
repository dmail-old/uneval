# API

* [parenthesis](#parenthesis)
* [useNew](#usenew)
* [arrayConstructor](#arrayconstructor)
* [objectConstructor](#objectconstructor)
* [compact](#compact)
* [showFunctionBody](#showfunctionbody)
* [indentUsingTab](#indentusingtab)
* [indentSize](#indentsize)

## parenthesis

```javascript
import { uneval } from "@dmail/uneval"

uneval({ foo: true })
/*
{
  foo: true
}
*/

uneval({ foo: true }, { parenthesis: true })
/*
({
  foo: true
})
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

## arrayConstructor

```javascript
import { uneval } from "@dmail/uneval"

uneval([])
/*
[]
*/

uneval([], { arrayConstructor: true })
/*
new Array()
*/
```

## objectConstructor

```javascript
import { uneval } from "@dmail/uneval"

uneval({})
/*
{}
*/

uneval({}, { objectConstructor: true })
/*
new Object()
*/
```

## compact

```javascript
import { uneval } from "@dmail/uneval"

uneval({ foo: true })
/*
{
  foo: true
}
*/

uneval({ foo: true }, { compact: true })
/*
{foo: true}
*/
```

## showFunctionBody

```javascript
import { uneval } from "@dmail/uneval"

const fn = () => 10

uneval(() => 10)
/*
function fn
*/

uneval(() => 10, { showFunctionBody: true })
/*
() => 10
*/
```

## indentUsingTab

```javascript
import { uneval } from "@dmail/uneval"

uneval({ foo: true })
/*
{
  foo: true
}
*/

uneval({ foo: true }, { indentUsingTabs: true })
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

uneval({ foo: true })
/*
{
  foo: true
}
*/

uneval({ foo: true }, { indentSize: 4 })
/*
{
    foo: true
}
*/
```
