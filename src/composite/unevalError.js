import { unevalConstructor } from "../unevalConstructor.js"

export const unevalError = (
  error,
  { nestedUneval, useNew, parenthesis, accurateErrorProperties },
) => {
  const messageSource = nestedUneval(error.message)

  const errorSource = unevalConstructor(`${errorToConstructorName(error)}(${messageSource})`, {
    useNew,
    parenthesis,
  })
  if (accurateErrorProperties) {
    return makeErrorSourceAccurate({ error, errorSource, nestedUneval })
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

const errorToConstructorName = ({ name }) => {
  if (derivedErrorNameArray.includes(name)) {
    return name
  }
  return "Error"
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types
const derivedErrorNameArray = [
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
]
