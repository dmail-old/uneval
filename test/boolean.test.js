import { assert } from "./assert.js"
import { uneval } from "../index.js"

{
  const actual = uneval(true)
  const expected = "true"
  assert({ actual, expected })
}

assert({ actual: uneval(false), expected: "false" })

/* eslint-disable no-new-wrappers */
assert({ actual: uneval(new Boolean(true)), expected: "Boolean(true)" })

assert({ actual: uneval(new Boolean(true), { parenthesis: true }), expected: "(Boolean(true))" })

assert({ actual: uneval(new Boolean(true), { useNew: true }), expected: "new Boolean(true)" })

assert({
  actual: uneval(new Boolean(true), { parenthesis: true, useNew: true }),
  expected: "new (Boolean(true))",
})
