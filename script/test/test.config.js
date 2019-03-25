const { launchNode, launchChromium } = require("@jsenv/core")

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
