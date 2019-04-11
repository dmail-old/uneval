import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const actual = uneval(new Date(10))
  const expected = `Date(10)`
  assert({ actual, expected })
}

{
  const nowMs = Date.now()
  const actual = uneval(new Date(nowMs))
  const expected = `Date(${nowMs})`
  assert({ actual, expected })
}
