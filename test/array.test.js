import { assert } from "./assert.js"
import { uneval } from "../index.js"

assert({ actual: uneval([]), expected: `[]` })

assert({ actual: uneval([[]], { compact: true }), expected: `[[]]` })

assert({ actual: uneval(Array(3), { compact: true }), expected: `[,,]` })

assert({
  actual: uneval([Symbol()]),
  expected: `[
  Symbol()
]`,
})

{
  // eslint-disable-next-line no-array-constructor
  const newArray = new Array("foo", 1)
  assert({
    actual: uneval(newArray),
    expected: `[
  "foo",
  1
]`,
  })
  assert({ actual: uneval(newArray, { compact: true }), expected: `["foo", 1]` })
}

{
  const circularArray = [0]
  circularArray.push(circularArray)
  assert({
    actual: uneval(circularArray),
    expected: `[
  0,
  Symbol.for('circular')
]`,
  })
}
