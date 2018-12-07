"use strict";

var _assert = require("assert");

var _index = require("../index.js");

(0, _assert.equal)((0, _index.uneval)(new Date(10)), `Date(10)`);
{
  const nowMs = Date.now();
  (0, _assert.equal)((0, _index.uneval)(new Date(nowMs)), `Date(${nowMs})`);
}
//# sourceMappingURL=./date.js.map