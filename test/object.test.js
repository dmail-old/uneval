import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = {}
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  // eslint-disable-next-line no-new-object
  const expected = new Object({})
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = { foo: true }
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = { 0: "foo" }
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = { Infinity: "foo" }
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = { foo: true, nested: { bar: true } }
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = Object.create({
    foo: true,
  })
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = {}
  expected.self = expected
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = {
    nested: {},
  }
  expected.nested.parent = expected
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = Object.create(null)
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = Object.create(null)
  expected[Symbol.toStringTag] = "stuff"
  expected.foo = true
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const ancestor = {}
  const parent = Object.create(ancestor)
  const child = Object.create(parent)
  const expected = {
    child,
    ancestor,
    parent,
  }
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const parent = {}
  const value = Object.create(parent)
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (e) {
    assert({
      actual: e,
      expected: new Error(
        "prototype must be global, like Object.prototype, or somewhere in the value.",
      ),
    })
  }
}

{
  const value = {}
  Object.defineProperty(value, "answer", {
    get() {
      return 42
    },
  })
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (e) {
    assert({
      actual: e,
      expected: new Error("uneval does not accepts getter"),
    })
  }
}

{
  const value = {}
  // eslint-disable-next-line accessor-pairs
  Object.defineProperty(value, "answer", {
    set() {
      return 42
    },
  })
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (e) {
    assert({
      actual: e,
      expected: new Error("uneval does not accepts setter"),
    })
  }
}
