"use strict";

var _assert = require("assert");

var _index = require("../index.js");

(0, _assert.equal)((0, _index.uneval)(0), "0");
(0, _assert.equal)((0, _index.uneval)(1), "1");
(0, _assert.equal)((0, _index.uneval)(-0), "-0");
(0, _assert.equal)((0, _index.uneval)(Infinity), "Infinity");
(0, _assert.equal)((0, _index.uneval)(new Number(0)), "Number(0)");
(0, _assert.equal)((0, _index.uneval)(new Number(0), {
  parenthesis: true
}), "(Number(0))");
(0, _assert.equal)((0, _index.uneval)(new Number(0), {
  useNew: true
}), "new Number(0)");
(0, _assert.equal)((0, _index.uneval)(new Number(0), {
  parenthesis: true,
  useNew: true
}), "new (Number(0))");
//# sourceMappingURL=./number.js.map