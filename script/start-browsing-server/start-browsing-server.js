const { startBrowsingServer } = require("@jsenv/core")
const { importMap, projectFolder, compileInto, babelConfigMap } = require("../../jsenv.config.js")

startBrowsingServer({
  importMap,
  projectFolder,
  compileInto,
  compileGroupCount: 2,
  babelConfigMap,
  browsableDescription: {
    "/index.js": true,
    "/src/**/*.js": true,
    "/test/**/*.js": true,
  },
  protocol: "http",
  ip: "127.0.0.1",
  port: 3456,
  forcePort: true,
})
