const { launchNode, launchChromium } = require("@jsenv/core")

const projectPath = __dirname
exports.projectPath = projectPath

const testDescription = {
  "/test/**/*.test.js": {
    browser: {
      launch: launchChromium,
    },
    node: {
      launch: launchNode,
    },
  },
}
exports.testDescription = testDescription
