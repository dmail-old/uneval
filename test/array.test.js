import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = []
  const actual = eval(uneval(actual))
  assert({ actual, expected })
}

{
  const expected = [[]]
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = Array(3)
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = [Symbol()]
  const actual = eval(uneval(expected))
  assert({
    actual,
    expected,
  })
}

{
  // eslint-disable-next-line no-array-constructor
  const expected = new Array("foo", 1)
  const actual = eval(uneval(expected))
  assert({
    actual,
    expected,
  })
}

{
  const expected = []
  expected.push(expected)
  const actual = eval(uneval(expected))
  assert({
    actual,
    expected,
  })
}
