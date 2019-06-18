import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const value = {}
  // eslint-disable-next-line accessor-pairs
  Object.defineProperty(value, "answer", {
    set() {
      return 42
    },
  })
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (actual) {
    const expected = new Error("uneval does not accepts setter")
    assert({
      actual,
      expected,
    })
  }
}
