import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = true
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = false
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  // eslint-disable-next-line no-new-wrappers
  const expected = new Boolean(true)
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}
