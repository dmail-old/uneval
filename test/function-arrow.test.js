import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = () => {}
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = {
    function: () => {},
  }
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}
