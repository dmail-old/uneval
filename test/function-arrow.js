import { equal } from "assert"
import { uneval } from "../index.js"

equal(uneval(() => {}), `() => {/* hidden */}`)
equal(uneval(() => {}, { showFunctionBody: true }), "() => {}")
equal(uneval(() => true, { showFunctionBody: true }), `() => true`)

{
  const named = (a) => a
  equal(uneval(named), `() => {/* hidden */}`)
  equal(uneval(named, { showFunctionBody: true }), "a => a")
}

{
  const nested = {
    function: () => {},
  }
  equal(
    uneval(nested),
    `{
  "function": () => {/* hidden */}
}`,
  )
}
