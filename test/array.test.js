import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const actual = uneval([])
  const expected = `[]`
  assert({ actual, expected })
}

{
  const actual = uneval([[]], { compact: true })
  const expected = `[[]]`
  assert({ actual, expected })
}

{
  const actual = uneval(Array(3), { compact: true })
  const expected = `[,,]`
  assert({ actual, expected })
}

{
  const actual = uneval([Symbol()])
  const expected = `[
  Symbol()
]`
  assert({
    actual,
    expected,
  })
}

{
  // eslint-disable-next-line no-array-constructor
  const newArray = new Array("foo", 1)

  {
    const actual = uneval(newArray)
    const expected = `[
  "foo",
  1
]`
    assert({
      actual,
      expected,
    })
  }

  {
    const actual = uneval(newArray, { compact: true })
    const expected = `["foo", 1]`
    assert({ actual, expected })
  }
}

{
  const circularArray = [0]
  circularArray.push(circularArray)
  const actual = uneval(circularArray)
  const expected = `[
  0,
  Symbol.for('circular')
]`
  assert({
    actual,
    expected,
  })
}
