import { quote } from "../util.js"
import { unevalComposite } from "../composite/index.js"

const unevalBoolean = (value) => value.toString()

const unevalFunction = (value, { showFunctionBody, parenthesis, depth }) => {
  let functionSource
  if (showFunctionBody) {
    functionSource = value.toString()
  } else {
    const isArrowFunction = value.prototype === undefined
    const head = isArrowFunction ? "() =>" : `function ${depth === 0 ? value.name : ""}()`
    functionSource = `${head} {/* hidden */}`
  }

  if (parenthesis) {
    return `(${functionSource})`
  }
  return functionSource
}

const unevalNull = () => "null"

const unevalNumber = (value) => {
  return Object.is(value, -0) ? "-0" : value.toString()
}

const unevalString = (value, { singleQuote }) => {
  const quotedValue = quote(value)
  return singleQuote ? `'${quotedValue}'` : `"${quotedValue}"`
}

const unevalSymbol = (value, options) => {
  const toStringResult = value.toString()
  const openingParenthesisIndex = toStringResult.indexOf("(")
  const closingParenthesisIndex = toStringResult.indexOf(")")
  const symbolDescription = toStringResult.slice(
    openingParenthesisIndex + 1,
    closingParenthesisIndex,
  )
  const symbolDescriptionSource = symbolDescription ? unevalString(symbolDescription, options) : ""
  const symbolSource = `Symbol(${symbolDescriptionSource})`
  if (options.parenthesis) {
    return `${symbolSource}`
  }
  return symbolSource
}

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
    singleQuote = false,
    useNew = false,
    objectConstructor = false,
    compact = false,
    showFunctionBody = false,
    indentUsingTab = false,
    indentSize = 2,
    depth = 0, // internal, not meant to be used in public api
    ...remainingProps
  } = {},
) => {
  const type = getPrimitiveType(value)
  return mappings[type](value, {
    parenthesis,
    singleQuote,
    useNew,
    objectConstructor,
    compact,
    showFunctionBody,
    indentUsingTab,
    indentSize,
    depth,
    ...remainingProps,
  })
}
