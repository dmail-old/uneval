const { bundleBrowser } = require("@jsenv/core")
const {
  projectFolder,
  entryPointsDescription,
  babelPluginDescription,
} = require("../../jsenv.config.js")
const importMap = require("../../importMap.json")

bundleBrowser({
  importMap,
  projectFolder,
  into: "dist/browser",
  entryPointsDescription,
  babelPluginDescription,
  globalName: "__dmail_uneval__",
  verbose: true,
  // here can add usageMap, compileGroupCount
})
