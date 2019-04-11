import { unevalConstructor } from "../unevalConstructor.js"

export const unevalStringObject = (value, { nestedUneval, useNew, parenthesis }) => {
  const stringSource = nestedUneval(value.valueOf())

  return unevalConstructor(`String(${stringSource})`, { useNew, parenthesis })
}
