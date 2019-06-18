import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const value = {}
  Object.defineProperty(value, "answer", {
    get() {
      return 42
    },
  })
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (actual) {
    const expected = new Error("uneval does not accepts getter")
    assert({
      actual,
      expected,
    })
  }
}
