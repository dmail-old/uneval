import { assert } from "./assert.js"
import { uneval } from "../index.js"

assert({ actual: uneval(/ok/g), expected: "/ok/g" })

assert({ actual: uneval(new RegExp("foo", "g")), expected: "/foo/g" })
