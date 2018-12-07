module.exports = {
  metas: {
    source: {
      "index.js": true,
      "src/**/*.js": true,
    },
    prettify: {
      "index.js": true,
      "index.test.js": true,
      "src/**/*.js": true,
      "script/**/*.js": true,
      "**/*.md": true,
      "**/*.json": true,
      "package.json": false,
      "package-lock.json": false,
    },
    compile: {
      "index.js": true,
      "index.test.js": true,
      "src/**/*.js": true,
      "test/**/*.js": true,
    },
  },
}
