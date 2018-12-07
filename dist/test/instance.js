"use strict";

var _assert = require("assert");

var _index = require("../index.js");

{
  const CustomConstructor = function () {
    this.foo = true;
  };

  const customInstance = new CustomConstructor();
  (0, _assert.equal)((0, _index.uneval)(customInstance), `CustomConstructor({
  "foo": true
})`);
}
//# sourceMappingURL=./instance.js.map