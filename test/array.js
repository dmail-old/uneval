import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval([]), `[]`)
equal(uneval([[]], { compact: true }), `[[]]`)
equal(uneval(Array(3), { compact: true }), `[,,]`)
equal(
  uneval([Symbol()]),
  `[
  Symbol()
]`,
)

{
  // eslint-disable-next-line no-array-constructor
  const newArray = new Array("foo", 1)
  equal(
    uneval(newArray),
    `[
  "foo",
  1
]`,
  )
  equal(uneval(newArray, { compact: true }), `["foo", 1]`)
}

{
  const circularArray = [0]
  circularArray.push(circularArray)
  equal(
    uneval(circularArray),
    `[
  0,
  Symbol.for('circular')
]`,
  )
}
