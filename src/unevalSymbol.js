export const unevalSymbol = (value, { nestedUneval, parenthesis }) => {
  const toStringResult = value.toString()
  const openingParenthesisIndex = toStringResult.indexOf("(")
  const closingParenthesisIndex = toStringResult.indexOf(")")
  const symbolDescription = toStringResult.slice(
    openingParenthesisIndex + 1,
    closingParenthesisIndex,
  )
  const symbolDescriptionSource = symbolDescription ? nestedUneval(symbolDescription) : ""
  const symbolSource = `Symbol(${symbolDescriptionSource})`
  if (parenthesis) {
    return `${symbolSource}`
  }
  return symbolSource
}
