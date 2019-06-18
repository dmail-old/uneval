import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const value = () => {}
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (actual) {
    const expected = new Error("function are not allowed.")
    assert({ actual, expected })
  }
}
