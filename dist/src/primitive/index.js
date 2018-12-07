"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unevalPrimitive = void 0;

var _util = require("../util.js");

var _index = require("../composite/index.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const unevalBoolean = value => value.toString();

const unevalFunction = (value, {
  showFunctionBody,
  parenthesis,
  depth
}) => {
  let functionSource;

  if (showFunctionBody) {
    functionSource = value.toString();
  } else {
    const isArrowFunction = value.prototype === undefined;
    const head = isArrowFunction ? "() =>" : `function ${depth === 0 ? value.name : ""}()`;
    functionSource = `${head} {/* hidden */}`;
  }

  if (parenthesis) {
    return `(${functionSource})`;
  }

  return functionSource;
};

const unevalNull = () => "null";

const unevalNumber = value => {
  return Object.is(value, -0) ? "-0" : value.toString();
};

const unevalString = (value, {
  singleQuote
}) => {
  const quotedValue = (0, _util.quote)(value);
  return singleQuote ? `'${quotedValue}'` : `"${quotedValue}"`;
};

const unevalSymbol = (value, options) => {
  const toStringResult = value.toString();
  const openingParenthesisIndex = toStringResult.indexOf("(");
  const closingParenthesisIndex = toStringResult.indexOf(")");
  const symbolDescription = toStringResult.slice(openingParenthesisIndex + 1, closingParenthesisIndex);
  const symbolDescriptionSource = symbolDescription ? unevalString(symbolDescription, options) : "";
  const symbolSource = `Symbol(${symbolDescriptionSource})`;

  if (options.parenthesis) {
    return `${symbolSource}`;
  }

  return symbolSource;
};

const unevalUndefined = () => "undefined";

const getPrimitiveType = value => {
  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "undefined";
  }

  return typeof value;
};

const mappings = {
  boolean: unevalBoolean,
  function: unevalFunction,
  null: unevalNull,
  number: unevalNumber,
  object: _index.unevalComposite,
  string: unevalString,
  symbol: unevalSymbol,
  undefined: unevalUndefined
};

const unevalPrimitive = (value, _ref = {}) => {
  let {
    parenthesis = false,
    singleQuote = false,
    useNew = false,
    objectConstructor = false,
    compact = false,
    showFunctionBody = false,
    indentUsingTab = false,
    indentSize = 2,
    depth = 0
  } = _ref,
      remainingProps = _objectWithoutProperties(_ref, ["parenthesis", "singleQuote", "useNew", "objectConstructor", "compact", "showFunctionBody", "indentUsingTab", "indentSize", "depth"]);

  const type = getPrimitiveType(value);
  return mappings[type](value, _objectSpread({
    parenthesis,
    singleQuote,
    useNew,
    objectConstructor,
    compact,
    showFunctionBody,
    indentUsingTab,
    indentSize,
    depth
  }, remainingProps));
};

exports.unevalPrimitive = unevalPrimitive;
//# sourceMappingURL=./index.js.map