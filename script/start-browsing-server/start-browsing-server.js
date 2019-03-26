const { startBrowsingServer } = require("@jsenv/core")
const { projectFolder, compileInto, babelPluginDescription } = require("../../jsenv.config.js")
const importMap = require("../../importMap.json")

const browsableDescription = {
  "/index.js": true,
  "/src/**/*.js": true,
  "/test/**/*.js": true,
}

startBrowsingServer({
  importMap,
  projectFolder,
  compileInto,
  compileGroupCount: 2,
  babelPluginDescription,
  browsableDescription,
  protocol: "http",
  ip: "127.0.0.1",
  port: 3456,
  forcePort: true,
})
