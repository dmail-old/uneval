import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval(0), "0")
equal(uneval(1), "1")
equal(uneval(-0), "-0")
equal(uneval(Infinity), "Infinity")
equal(uneval(new Number(0)), "Number(0)")
equal(uneval(new Number(0), { parenthesis: true }), "(Number(0))")
equal(uneval(new Number(0), { useNew: true }), "new Number(0)")
equal(uneval(new Number(0), { parenthesis: true, useNew: true }), "new (Number(0))")
