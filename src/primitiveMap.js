import { unevalBoolean } from "./unevalBoolean.js"
import { unevalNull } from "./unevalNull.js"
import { unevalNumber } from "./unevalNumber.js"
import { unevalString } from "./unevalString.js"
import { unevalSymbol } from "./unevalSymbol.js"
import { unevalUndefined } from "./unevalUndefined.js"

export const primitiveMap = {
  boolean: unevalBoolean,
  null: unevalNull,
  number: unevalNumber,
  string: unevalString,
  symbol: unevalSymbol,
  undefined: unevalUndefined,
}
