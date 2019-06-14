import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = Symbol()
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = Symbol("foo")
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = Symbol(42)
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}
