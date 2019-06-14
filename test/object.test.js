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
