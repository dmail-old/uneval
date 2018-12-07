"use strict";

var _assert = require("assert");

var _index = require("../index.js");

(0, _assert.equal)((0, _index.uneval)(""), `""`);
(0, _assert.equal)((0, _index.uneval)("dam"), `"dam"`);
(0, _assert.equal)((0, _index.uneval)("don't"), `"don\\\'t"`);
(0, _assert.equal)(eval((0, _index.uneval)("don't")), "don't");
(0, _assert.equal)((0, _index.uneval)(`his name is "dam"`), `"his name is \\\"dam\\\""`);
(0, _assert.equal)((0, _index.uneval)("a\nb"), `"a\\nb"`);
(0, _assert.equal)((0, _index.uneval)("a\rb"), `"a\\rb"`);
(0, _assert.equal)((0, _index.uneval)("a\u2028b"), `"a\\u2028b"`);
(0, _assert.equal)((0, _index.uneval)("a\u2029b"), `"a\\u2029b"`); // eslint-disable-next-line no-new-wrappers

(0, _assert.equal)((0, _index.uneval)(new String("")), `String("")`); // eslint-disable-next-line no-new-wrappers

(0, _assert.equal)((0, _index.uneval)(new String("dam")), `String("dam")`);
(0, _assert.equal)((0, _index.uneval)("dam", {
  singleQuote: true
}), `'dam'`);
(0, _assert.equal)((0, _index.uneval)("don't", {
  singleQuote: true
}), `'don\\\'t'`);
(0, _assert.equal)(eval((0, _index.uneval)("don't", {
  singleQuote: true
})), "don't");
//# sourceMappingURL=./string.js.map