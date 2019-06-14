import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = new Date(10)
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = new Date()
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}
