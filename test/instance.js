import { equal } from "assert"
import { uneval } from "../index.js"

{
  const CustomConstructor = function() {
    this.foo = true
  }
  const customInstance = new CustomConstructor()
  equal(
    uneval(customInstance),
    `CustomConstructor({
  "foo": true
})`,
  )
}
