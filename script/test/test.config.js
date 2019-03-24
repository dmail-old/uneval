const { launchNode, launchChromium } = require("@jsenv/core")

const testDescription = {
  "/test/browser/*.test.*": {
    browser: {
      launch: launchChromium,
    },
  },
  "/test/node/*.test.*": {
    node: {
      launch: launchNode,
    },
  },
}
exports.testDescription = testDescription
