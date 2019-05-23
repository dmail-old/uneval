import { unevalArray } from "./unevalArray.js"
import { unevalObject } from "./unevalObject.js"
import { unevalFunction } from "./unevalFunction.js"
import { unevalDate } from "./unevalDate.js"
import { unevalNumberObject } from "./unevalNumberObject.js"
import { unevalStringObject } from "./unevalStringObject.js"
import { unevalBooleanObject } from "./unevalBooleanObject.js"
import { unevalError } from "./unevalError.js"
import { unevalRegExp } from "./unevalRegExp.js"

export const compositeMap = {
  Array: unevalArray,
  Boolean: unevalBooleanObject,
  Error: unevalError,
  Date: unevalDate,
  Function: unevalFunction,
  Number: unevalNumberObject,
  Object: unevalObject,
  RegExp: unevalRegExp,
  String: unevalStringObject,
}
