import { assert } from "./assert.js"
import { uneval } from "../index.js"

assert({ actual: uneval(Symbol()), expected: "Symbol()" })

assert({ actual: uneval(Symbol("foo")), expected: `Symbol("foo")` })

assert({ actual: uneval(Symbol(42)), expected: `Symbol("42")` })
