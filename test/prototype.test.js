import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

// unknown prototype
{
  const prototypeValue = {}
  const value = Object.create(prototypeValue)
  try {
    uneval(value)
    throw new Error("should throw")
  } catch (actual) {
    const expected = new Error(
      "prototype must be global, like Object.prototype, or somewhere in the value.",
    )
    assert({
      actual,
      expected,
    })
  }
}

// unknown prototype by constructor
{
  function CustomConstructor() {
    this.foo = true
  }
  const value = new CustomConstructor()
  try {
    uneval(value)
  } catch (actual) {
    const expected = new Error(
      "prototype must be global, like Object.prototype, or somewhere in the value.",
    )
    assert({
      actual,
      expected,
    })
  }
}

// null prototype
{
  const value = Object.create(null)
  const actual = eval(uneval(value))
  const expected = value
  assert({ actual, expected })
}

// prototype in the value
{
  const ancestor = {}
  const parent = Object.create(ancestor)
  const child = Object.create(parent)
  const value = {
    child,
    ancestor,
    parent,
  }
  const actual = eval(uneval(value))
  const expected = value
  assert({ actual, expected })
}
