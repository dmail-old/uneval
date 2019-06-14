import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = 0
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = 1
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = -0
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = Infinity
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  // eslint-disable-next-line no-new-wrappers
  const expected = new Number(0)
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}
