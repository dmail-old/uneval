const { bundleBrowser } = require("@jsenv/core")
const { projectPath } = require("../../jsenv.config.js")

bundleBrowser({
  projectPath,
})
