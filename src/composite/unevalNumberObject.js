import { unevalConstructor } from "../unevalConstructor.js"

export const unevalNumberObject = (value, { nestedUneval, useNew, parenthesis }) => {
  const numberSource = nestedUneval(value.valueOf())

  return unevalConstructor(`Number(${numberSource})`, { useNew, parenthesis })
}
