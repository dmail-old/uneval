import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval(/ok/g), "/ok/g")
equal(uneval(new RegExp("foo", "g")), "/foo/g")
