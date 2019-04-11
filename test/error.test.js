import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

assert({ actual: uneval(new Error("here")), expected: `Error("here")` })

assert({ actual: uneval(new RangeError("here")), expected: `RangeError("here")` })
