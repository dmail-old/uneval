import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval(null), "null")
