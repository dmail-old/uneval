import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

assert({ actual: uneval(new Error("here")), expected: `Error("here")` })

assert({ actual: uneval(new RangeError("here")), expected: `RangeError("here")` })

{
  const actualError = new Error("hello")
  Object.defineProperty(actualError, "bar", {
    enumerable: false,
    value: "bar",
  })
  const actual = uneval(actualError, { accurateErrorProperties: true })
  const expected = `(function (error) {
  Object.defineProperty(error, "stack", {
    "value": ${uneval(actualError.stack)},
    "writable": true,
    "enumerable": false,
    "configurable": true
  })
  Object.defineProperty(error, "bar", {
    "value": "bar",
    "writable": false,
    "enumerable": false,
    "configurable": false
  })
  return error
})(Error("hello"))`
  assert({ actual, expected })

  const expectedError = eval(actual)
  assert({
    actual: actualError,
    expected: expectedError,
  })
}

{
  const error = new Error()
  error.name = "AssertionError"
  const actual = uneval(error)
  const expected = `Error("")`
  assert({ actual, expected })
}
