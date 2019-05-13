import { unevalConstructor } from "../unevalConstructor.js"

export const unevalError = (
  value,
  { nestedUneval, useNew, parenthesis, accurateErrorProperties },
) => {
  const messageSource = nestedUneval(value.message)

  const errorSource = unevalConstructor(`${value.name}(${messageSource})`, { useNew, parenthesis })
  if (accurateErrorProperties) {
    return makeErrorSourceAccurate({ error: value, errorSource, nestedUneval })
  }
  return errorSource
}

const makeErrorSourceAccurate = ({ error, errorSource, nestedUneval }) => {
  const ownPropertyNames = Object.getOwnPropertyNames(error).filter((name) => {
    return name !== "message"
  })

  const definePropertiesSource = ownPropertyNames.map((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(error, name)
    return `Object.defineProperty(error, ${nestedUneval(name)}, ${nestedUneval(descriptor)})`
  })

  // TODO: make indentation dependent of current depth
  return `(function (error) {
  ${definePropertiesSource.join(`
  `)}
  return error
})(${errorSource})`
}
