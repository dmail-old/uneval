import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

assert({ actual: uneval({}), expected: "{}" })

// eslint-disable-next-line no-new-object
assert({ actual: uneval(new Object({})), expected: "{}" })

assert({ actual: uneval({}, { objectConstructor: true }), expected: "Object({})" })

assert({
  actual: uneval({ foo: true }, { objectConstructor: true, useNew: true, compact: true }),
  expected: `new Object({"foo": true})`,
})

assert({ actual: uneval({ 0: "foo" }, { compact: true }), expected: `{0: "foo"}` })

assert({ actual: uneval({ Infinity: "foo" }, { compact: true }), expected: `{"Infinity": "foo"}` })

assert({
  actual: uneval({ name: "dam" }, { singleQuote: true, compact: true }),
  expected: `{'name': 'dam'}`,
})

assert({
  actual: uneval({ foo: true, nested: { bar: true } }, { parenthesis: true }),
  expected: `({
  "foo": true,
  "nested": ({
    "bar": true
  })
})`,
})

{
  const foo = { foo: true, bar: false }
  assert({
    actual: uneval(foo),
    expected: `{
  "foo": true,
  "bar": false
}`,
  })
  assert({ actual: uneval(foo, { compact: true }), expected: `{"foo": true, "bar": false}` })
}

assert({
  actual: uneval(
    Object.create({
      foo: true,
    }),
  ),
  expected: "{}",
})

{
  const nested = { foo: { name: "dam" } }
  assert({
    actual: uneval(nested),
    expected: `{
  "foo": {
    "name": "dam"
  }
}`,
  })
  assert({ actual: uneval(nested, { compact: true }), expected: `{"foo": {"name": "dam"}}` })
}

{
  const circularObject = {
    foo: true,
  }
  circularObject.self = circularObject
  assert({
    actual: uneval(circularObject),
    expected: `{
  "foo": true,
  "self": Symbol.for('circular')
}`,
  })
}

{
  const nestedCircularObject = {
    foo: true,
  }
  nestedCircularObject.nested = {
    bar: true,
    parent: nestedCircularObject,
  }
  assert({
    actual: uneval(nestedCircularObject),
    expected: `{
  "foo": true,
  "nested": {
    "bar": true,
    "parent": Symbol.for('circular')
  }
}`,
  })
}

{
  const actual = uneval(Object.create(null))
  const expected = "{}"
  assert({ actual, expected })
}

{
  const object = Object.create(null)
  object[Symbol.toStringTag] = "stuff"
  const actual = uneval(object)
  const expected = "{}"
  assert({ actual, expected })
}

{
  const object = Object.create(null)
  object[Symbol.toStringTag] = "stuff"
  object.foo = true
  const actual = uneval(object)
  const expected = `{
  "foo": true
}`
  assert({ actual, expected })
}
