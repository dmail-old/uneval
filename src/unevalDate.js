import { unevalConstructor } from "./unevalConstructor.js"

export const unevalDate = (value, { nestedUneval, useNew, parenthesis }) => {
  const dateSource = nestedUneval(value.valueOf())
  return unevalConstructor(`Date(${dateSource})`, { useNew, parenthesis })
}
