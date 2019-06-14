import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

const expected = undefined
const actual = eval(uneval(expected))
assert({ actual, expected })
