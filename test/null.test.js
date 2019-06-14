import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

const expected = null
const actual = eval(uneval(expected))
assert({
  actual,
  expected,
})
