import { assert } from "./assert.js"
import { uneval } from "../index.js"

{
  const CustomConstructor = function() {
    this.foo = true
  }
  const customInstance = new CustomConstructor()
  const actual = uneval(customInstance)
  const expected = `CustomConstructor({
  "foo": true
})`
  assert({ actual, expected })
}
