import { unevalConstructor } from "../unevalConstructor.js"

export const unevalError = (value, { nestedUneval, useNew, parenthesis }) => {
  const messageSource = nestedUneval(value.message)

  return unevalConstructor(`${value.name}(${messageSource})`, { useNew, parenthesis })
}
