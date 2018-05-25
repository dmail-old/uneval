import { unevalConstructor, quote } from "../util.js"
import { unevalComposite } from "../composite/index.js"

const unevalBoolean = (value) => value.toString()

const unevalFunction = (value, { showFunctionBody, parenthesis }) => {
  if (showFunctionBody) {
    if (parenthesis) {
      return `(${value.toString()})`
    }

    return value.toString()
  }

  return value.name ? `function ${value.name}` : "function"
}

const unevalNull = () => "null"

const unevalNumber = (value) => value.toString()

const unevalString = (value) => `"${quote(value)}"`

const unevalSymbol = (options) => unevalConstructor("Symbol", options)

const unevalUndefined = () => "undefined"

const getPrimitiveType = (value) => {
  if (value === null) {
    return "null"
  }

  if (value === undefined) {
    return "undefined"
  }

  return typeof value
}

const mappings = {
  boolean: unevalBoolean,
  function: unevalFunction,
  null: unevalNull,
  number: unevalNumber,
  object: unevalComposite,
  string: unevalString,
  symbol: unevalSymbol,
  undefined: unevalUndefined,
}

export const unevalPrimitive = (
  value,
  {
    parenthesis = false,
    useNew = false,
    arrayConstructor = false,
    objectConstructor = false,
    compact = false,
    showFunctionBody = false,
    indentUsingTab = false,
    indentSize = 2,
    ...remainingProps
  } = {},
) => {
  const type = getPrimitiveType(value)
  return mappings[type](value, {
    parenthesis,
    useNew,
    arrayConstructor,
    objectConstructor,
    compact,
    showFunctionBody,
    indentUsingTab,
    indentSize,
    ...remainingProps,
  })
}
