import { assert } from "./assert.js"
import { uneval } from "../index.js"

assert({ actual: uneval(0), expected: "0" })

assert({ actual: uneval(1), expected: "1" })

assert({ actual: uneval(-0), expected: "-0" })

assert({ actual: uneval(Infinity), expected: "Infinity" })

assert({
  // eslint-disable-next-line no-new-wrappers
  actual: uneval(new Number(0)),
  expected: "Number(0)",
})

assert({
  // eslint-disable-next-line no-new-wrappers
  actual: uneval(new Number(0), { parenthesis: true }),
  expected: "(Number(0))",
})

assert({
  // eslint-disable-next-line no-new-wrappers
  actual: uneval(new Number(0), { useNew: true }),
  expected: "new Number(0)",
})

assert({
  // eslint-disable-next-line no-new-wrappers
  actual: uneval(new Number(0), { parenthesis: true, useNew: true }),
  expected: "new (Number(0))",
})
