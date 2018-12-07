import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval(new Date(10)), `Date(10)`)
{
  const nowMs = Date.now()
  equal(uneval(new Date(nowMs)), `Date(${nowMs})`)
}
