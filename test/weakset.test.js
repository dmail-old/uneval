import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const value = new WeakSet()
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (actual) {
    const expected = new Error("weakSet are not supported.")
    assert({ actual, expected })
  }
}

{
  const value = {
    foo: new WeakSet(),
  }
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (actual) {
    const expected = new Error(`weakSet are not supported.
weakSet found at: ["foo"][[propertyDescriptor:value]]`)
    assert({ actual, expected })
  }
}