"use strict";

var _assert = require("assert");

var _index = require("../index.js");

(0, _assert.equal)((0, _index.uneval)(() => {}), `() => {/* hidden */}`);
(0, _assert.equal)((0, _index.uneval)(() => {}, {
  showFunctionBody: true
}), "() => {}");
(0, _assert.equal)((0, _index.uneval)(() => true, {
  showFunctionBody: true
}), `() => true`);
{
  const named = a => a;

  (0, _assert.equal)((0, _index.uneval)(named), `() => {/* hidden */}`);
  (0, _assert.equal)((0, _index.uneval)(named, {
    showFunctionBody: true
  }), "a => a");
}
{
  const nested = {
    function: () => {}
  };
  (0, _assert.equal)((0, _index.uneval)(nested), `{
  "function": () => {/* hidden */}
}`);
}
//# sourceMappingURL=./function-arrow.js.map