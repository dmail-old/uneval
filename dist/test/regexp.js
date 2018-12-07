"use strict";

var _assert = require("assert");

var _index = require("../index.js");

(0, _assert.equal)((0, _index.uneval)(/ok/g), "/ok/g");
(0, _assert.equal)((0, _index.uneval)(new RegExp("foo", "g")), "/foo/g");
//# sourceMappingURL=./regexp.js.map