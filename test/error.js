import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval(new Error("here")), `Error("here")`)
equal(uneval(new RangeError("here")), `RangeError("here")`)
