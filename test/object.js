import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval({}), "{}")
// eslint-disable-next-line no-new-object
equal(uneval(new Object({})), "{}")
equal(uneval({}, { objectConstructor: true }), "Object({})")
equal(
  uneval({ foo: true }, { objectConstructor: true, useNew: true, compact: true }),
  `new Object({"foo": true})`,
)
equal(uneval({ 0: "foo" }, { compact: true }), `{0: "foo"}`)
equal(uneval({ Infinity: "foo" }, { compact: true }), `{"Infinity": "foo"}`)
equal(uneval({ name: "dam" }, { singleQuote: true, compact: true }), `{'name': 'dam'}`)

equal(
  uneval({ foo: true, nested: { bar: true } }, { parenthesis: true }),
  `({
  "foo": true,
  "nested": ({
    "bar": true
  })
})`,
)

{
  const foo = { foo: true, bar: false }
  equal(
    uneval(foo),
    `{
  "foo": true,
  "bar": false
}`,
  )
  equal(uneval(foo, { compact: true }), `{"foo": true, "bar": false}`)
}

equal(
  uneval(
    Object.create({
      foo: true,
    }),
  ),
  "{}",
)

{
  const nested = { foo: { name: "dam" } }
  equal(
    uneval(nested),
    `{
  "foo": {
    "name": "dam"
  }
}`,
  )
  equal(uneval(nested, { compact: true }), `{"foo": {"name": "dam"}}`)
}

{
  const circularObject = {
    foo: true,
  }
  circularObject.self = circularObject
  equal(
    uneval(circularObject),
    `{
  "foo": true,
  "self": Symbol.for('circular')
}`,
  )
}

{
  const nestedCircularObject = {
    foo: true,
  }
  nestedCircularObject.nested = {
    bar: true,
    parent: nestedCircularObject,
  }
  equal(
    uneval(nestedCircularObject),
    `{
  "foo": true,
  "nested": {
    "bar": true,
    "parent": Symbol.for('circular')
  }
}`,
  )
}

{
  const actual = uneval(Object.create(null))
  const expected = "{}"
  equal(actual, expected)
}

{
  const object = Object.create(null)
  object[Symbol.toStringTag] = "stuff"
  const actual = uneval(object)
  const expected = "{}"
  equal(actual, expected)
}

{
  const object = Object.create(null)
  object[Symbol.toStringTag] = "stuff"
  object.foo = true
  const actual = uneval(object)
  const expected = `{
  "foo": true
}`
  equal(actual, expected)
}
