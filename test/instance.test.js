import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const CustomConstructor = function() {
    this.foo = true
  }
  const expected = new CustomConstructor()
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}
