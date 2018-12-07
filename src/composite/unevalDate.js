import { unevalConstructor } from "../util.js"
import { unevalPrimitive } from "../primitive/index.js"

export const unevalDate = (value, options = {}) => {
  const { depth = 0 } = options
  const dateSource = unevalPrimitive(value.valueOf(), { ...options, depth: depth + 1 })

  return unevalConstructor(`Date(${dateSource})`, options)
}
