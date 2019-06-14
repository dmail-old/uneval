import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = /ok/g
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = new RegExp("foo", "g")
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}
