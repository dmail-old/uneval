import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

assert({ actual: uneval(""), expected: `""` })

assert({ actual: uneval("dam"), expected: `"dam"` })

assert({ actual: uneval("don't"), expected: `"don\\\'t"` })

assert({ actual: eval(uneval("don't")), expected: "don't" })

assert({ actual: uneval(`his name is "dam"`), expected: `"his name is \\\"dam\\\""` })

assert({ actual: uneval("a\nb"), expected: `"a\\nb"` })

assert({ actual: uneval("a\rb"), expected: `"a\\rb"` })

assert({ actual: uneval("a\u2028b"), expected: `"a\\u2028b"` })

assert({ actual: uneval("a\u2029b"), expected: `"a\\u2029b"` })

assert({
  // eslint-disable-next-line no-new-wrappers
  actual: uneval(new String("")),
  expected: `String("")`,
})

assert({
  // eslint-disable-next-line no-new-wrappers
  actual: uneval(new String("dam")),
  expected: `String("dam")`,
})

assert({ actual: uneval("dam", { singleQuote: true }), expected: `'dam'` })

assert({ actual: uneval("don't", { singleQuote: true }), expected: `'don\\\'t'` })

assert({ actual: eval(uneval("don't", { singleQuote: true })), expected: "don't" })
