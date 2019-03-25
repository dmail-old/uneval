// until assert is written using jsenv style, it cannot
// be used here

export const assert = ({ actual, expected }) => {
  if (actual !== expected) {
    throw new Error(`unequal values.
actual: ${actual}
expected: ${expected}`)
  }
}
