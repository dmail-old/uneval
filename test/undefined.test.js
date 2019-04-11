import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

assert({ actual: uneval(undefined), expected: "undefined" })
