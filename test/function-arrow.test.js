import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = () => {}
  try {
    uneval(expected)
    throw new Error("should throw")
  } catch (e) {
    assert({ actual: e, expected: new Error("uneval does not accepts function") })
  }
}
