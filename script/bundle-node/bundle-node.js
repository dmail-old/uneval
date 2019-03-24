const { bundleNode } = require("@jsenv/core")
const {
  projectFolder,
  babelPluginDescription,
  entryPointsDescription,
} = require("../../jsenv.config.js")
const importMap = require("../../importMap.json")

bundleNode({
  importMap,
  projectFolder,
  into: "dist/node",
  entryPointsDescription,
  babelPluginDescription,
  verbose: true,
  // here can add usageMap, compileGroupCount
})
