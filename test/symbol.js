import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval(Symbol()), "Symbol()")
equal(uneval(Symbol("foo")), `Symbol("foo")`)
equal(uneval(Symbol(42)), `Symbol("42")`)
