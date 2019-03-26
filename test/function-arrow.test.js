import { assert } from "./assert.js"
import { uneval } from "../index.js"

{
  const actual = uneval(() => {})
  const expected = `() => {/* hidden */}`
  assert({ actual, expected })
}

assert({ actual: uneval(() => {}, { showFunctionBody: true }), expected: "() => {}" })

assert({ actual: uneval(() => true, { showFunctionBody: true }), expected: `() => true` })

{
  const named = (a) => a

  {
    const actual = uneval(named)
    const expected = `() => {/* hidden */}`
    assert({ actual, expected })
  }
  {
    const actual = uneval(named, { showFunctionBody: true })
    const expected = "a => a"
    assert({ actual, expected })
  }
}

{
  const nested = {
    function: () => {},
  }
  const actual = uneval(nested)
  const expected = `{
  "function": () => {/* hidden */}
}`
  assert({ actual, expected })
}
