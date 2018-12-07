"use strict";

var _assert = require("assert");

var _index = require("../index.js");

(0, _assert.equal)((0, _index.uneval)(true), "true");
(0, _assert.equal)((0, _index.uneval)(false), "false");
/* eslint-disable no-new-wrappers */

(0, _assert.equal)((0, _index.uneval)(new Boolean(true)), "Boolean(true)");
(0, _assert.equal)((0, _index.uneval)(new Boolean(true), {
  parenthesis: true
}), "(Boolean(true))");
(0, _assert.equal)((0, _index.uneval)(new Boolean(true), {
  useNew: true
}), "new Boolean(true)");
(0, _assert.equal)((0, _index.uneval)(new Boolean(true), {
  parenthesis: true,
  useNew: true
}), "new (Boolean(true))");
//# sourceMappingURL=./boolean.js.map