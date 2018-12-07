"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unevalDate = void 0;

var _util = require("../util.js");

var _index = require("../primitive/index.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const unevalDate = (value, options = {}) => {
  const {
    depth = 0
  } = options;
  const dateSource = (0, _index.unevalPrimitive)(value.valueOf(), _objectSpread({}, options, {
    depth: depth + 1
  }));
  return (0, _util.unevalConstructor)(`Date(${dateSource})`, options);
};

exports.unevalDate = unevalDate;
//# sourceMappingURL=./unevalDate.js.map