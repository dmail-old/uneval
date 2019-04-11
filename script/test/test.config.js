const { launchNode, launchChromium } = require("@jsenv/core")

const executeDescription = {
  "/test/**/*.test.js": {
    browser: {
      launch: launchChromium,
    },
    node: {
      launch: launchNode,
    },
  },
}
exports.executeDescription = executeDescription
