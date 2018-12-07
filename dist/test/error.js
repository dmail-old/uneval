"use strict";

var _assert = require("assert");

var _index = require("../index.js");

(0, _assert.equal)((0, _index.uneval)(new Error("here")), `Error("here")`);
(0, _assert.equal)((0, _index.uneval)(new RangeError("here")), `RangeError("here")`);
//# sourceMappingURL=./error.js.map