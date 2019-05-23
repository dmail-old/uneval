import { quote } from "./util.js"

export const unevalString = (value, { singleQuote }) => {
  const quotedValue = quote(value)
  return singleQuote ? `'${quotedValue}'` : `"${quotedValue}"`
}
