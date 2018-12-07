"use strict";

var _assert = require("assert");

var _index = require("../index.js");

(0, _assert.equal)((0, _index.uneval)(Symbol()), "Symbol()");
(0, _assert.equal)((0, _index.uneval)(Symbol("foo")), `Symbol("foo")`);
(0, _assert.equal)((0, _index.uneval)(Symbol(42)), `Symbol("42")`);
//# sourceMappingURL=./symbol.js.map