"use strict";

var _assert = require("assert");

var _index = require("../index.js");

(0, _assert.equal)((0, _index.uneval)([]), `[]`);
(0, _assert.equal)((0, _index.uneval)([[]], {
  compact: true
}), `[[]]`);
(0, _assert.equal)((0, _index.uneval)(Array(3), {
  compact: true
}), `[,,]`);
(0, _assert.equal)((0, _index.uneval)([Symbol()]), `[
  Symbol()
]`);
{
  // eslint-disable-next-line no-array-constructor
  const newArray = new Array("foo", 1);
  (0, _assert.equal)((0, _index.uneval)(newArray), `[
  "foo",
  1
]`);
  (0, _assert.equal)((0, _index.uneval)(newArray, {
    compact: true
  }), `["foo", 1]`);
}
{
  const circularArray = [0];
  circularArray.push(circularArray);
  (0, _assert.equal)((0, _index.uneval)(circularArray), `[
  0,
  Symbol.for('circular')
]`);
}
//# sourceMappingURL=./array.js.map