import { assert } from "./assert.js"
import { uneval } from "../index.js"

assert({ actual: uneval(undefined), expected: "undefined" })