import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = new Error("here")
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = new RangeError("here")
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = new Error("hello")
  Object.defineProperty(expected, "bar", {
    enumerable: false,
    value: "bar",
  })
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = new Error()
  expected.name = "AssertionError"
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}
