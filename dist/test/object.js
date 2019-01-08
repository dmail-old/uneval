"use strict";

var _assert = require("assert");

var _index = require("../index.js");

(0, _assert.equal)((0, _index.uneval)({}), "{}"); // eslint-disable-next-line no-new-object

(0, _assert.equal)((0, _index.uneval)(new Object({})), "{}");
(0, _assert.equal)((0, _index.uneval)({}, {
  objectConstructor: true
}), "Object({})");
(0, _assert.equal)((0, _index.uneval)({
  foo: true
}, {
  objectConstructor: true,
  useNew: true,
  compact: true
}), `new Object({"foo": true})`);
(0, _assert.equal)((0, _index.uneval)({
  0: "foo"
}, {
  compact: true
}), `{0: "foo"}`);
(0, _assert.equal)((0, _index.uneval)({
  Infinity: "foo"
}, {
  compact: true
}), `{"Infinity": "foo"}`);
(0, _assert.equal)((0, _index.uneval)({
  name: "dam"
}, {
  singleQuote: true,
  compact: true
}), `{'name': 'dam'}`);
(0, _assert.equal)((0, _index.uneval)({
  foo: true,
  nested: {
    bar: true
  }
}, {
  parenthesis: true
}), `({
  "foo": true,
  "nested": ({
    "bar": true
  })
})`);
{
  const foo = {
    foo: true,
    bar: false
  };
  (0, _assert.equal)((0, _index.uneval)(foo), `{
  "foo": true,
  "bar": false
}`);
  (0, _assert.equal)((0, _index.uneval)(foo, {
    compact: true
  }), `{"foo": true, "bar": false}`);
}
(0, _assert.equal)((0, _index.uneval)(Object.create({
  foo: true
})), "{}");
{
  const nested = {
    foo: {
      name: "dam"
    }
  };
  (0, _assert.equal)((0, _index.uneval)(nested), `{
  "foo": {
    "name": "dam"
  }
}`);
  (0, _assert.equal)((0, _index.uneval)(nested, {
    compact: true
  }), `{"foo": {"name": "dam"}}`);
}
{
  const circularObject = {
    foo: true
  };
  circularObject.self = circularObject;
  (0, _assert.equal)((0, _index.uneval)(circularObject), `{
  "foo": true,
  "self": Symbol.for('circular')
}`);
}
{
  const nestedCircularObject = {
    foo: true
  };
  nestedCircularObject.nested = {
    bar: true,
    parent: nestedCircularObject
  };
  (0, _assert.equal)((0, _index.uneval)(nestedCircularObject), `{
  "foo": true,
  "nested": {
    "bar": true,
    "parent": Symbol.for('circular')
  }
}`);
}
{
  const actual = (0, _index.uneval)(Object.create(null));
  const expected = "{}";
  (0, _assert.equal)(actual, expected);
}
{
  const object = Object.create(null);
  object[Symbol.toStringTag] = "stuff";
  const actual = (0, _index.uneval)(object);
  const expected = "{}";
  (0, _assert.equal)(actual, expected);
}
{
  const object = Object.create(null);
  object[Symbol.toStringTag] = "stuff";
  object.foo = true;
  const actual = (0, _index.uneval)(object);
  const expected = `{
  "foo": true
}`;
  (0, _assert.equal)(actual, expected);
}
//# sourceMappingURL=./object.js.map