import { assert } from "@dmail/assert"
import { uneval } from "../index.js"

{
  const expected = ""
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = "dam"
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = "don't"
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = `his name is "dam"`
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = "a\nb"
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = "a\rb"
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = "a\u2028b"
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  const expected = "a\u2029b"
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}

{
  // eslint-disable-next-line no-new-wrappers
  const expected = new String("")
  const actual = eval(uneval(expected))
  assert({ actual, expected })
}
