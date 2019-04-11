import { unevalConstructor } from "../unevalConstructor.js"

export const unevalBooleanObject = (value, { nestedUneval, useNew, parenthesis }) => {
  const booleanSource = nestedUneval(value.valueOf())
  return unevalConstructor(`Boolean(${booleanSource})`, { useNew, parenthesis })
}
