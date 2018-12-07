import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval(""), `""`)
equal(uneval("dam"), `"dam"`)
equal(uneval("don't"), `"don\\\'t"`)
equal(eval(uneval("don't")), "don't")
equal(uneval(`his name is "dam"`), `"his name is \\\"dam\\\""`)
equal(uneval("a\nb"), `"a\\nb"`)
equal(uneval("a\rb"), `"a\\rb"`)
equal(uneval("a\u2028b"), `"a\\u2028b"`)
equal(uneval("a\u2029b"), `"a\\u2029b"`)
// eslint-disable-next-line no-new-wrappers
equal(uneval(new String("")), `String("")`)
// eslint-disable-next-line no-new-wrappers
equal(uneval(new String("dam")), `String("dam")`)

equal(uneval("dam", { singleQuote: true }), `'dam'`)
equal(uneval("don't", { singleQuote: true }), `'don\\\'t'`)
equal(eval(uneval("don't", { singleQuote: true })), "don't")
