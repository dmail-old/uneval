import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const value = new Promise(() => {})
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (actual) {
    const expected = new Error("promise are not supported.")
    assert({ actual, expected })
  }
}

{
  const value = {
    foo: new Promise(() => {}),
  }
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (actual) {
    const expected = new Error(`promise are not supported.
promise found at: ["foo"][[propertyDescriptor:value]]`)
    assert({ actual, expected })
  }
}
