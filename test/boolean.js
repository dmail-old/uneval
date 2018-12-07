import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval(true), "true")
equal(uneval(false), "false")
/* eslint-disable no-new-wrappers */
equal(uneval(new Boolean(true)), "Boolean(true)")
equal(uneval(new Boolean(true), { parenthesis: true }), "(Boolean(true))")
equal(uneval(new Boolean(true), { useNew: true }), "new Boolean(true)")
equal(uneval(new Boolean(true), { parenthesis: true, useNew: true }), "new (Boolean(true))")
